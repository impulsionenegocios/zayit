import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { jwtDecode } from 'jwt-decode';
import axios from '@/lib/axios';
import { auth } from '@/firebase';

interface TokenData {
  exp: number;
  iat: number;
  auth_time: number;
  uid: string;
}

// Identificador para o interceptor
let requestInterceptorId: number | null = null;

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const perfil = ref<any>(null);
  const loading = ref(true);
  const tokenExpiry = ref<number>(0);
  const currentToken = ref<string>('');
  const authInitialized = ref(false);

  // Computed property para verificar autenticação
  const isAuthenticated = computed(() => !!user.value);

  // Getter para role (com fallback para localStorage)
  const getRole = computed(() => {
    if (perfil.value?.role) {
      return perfil.value.role;
    }
    // Fallback para localStorage se o perfil não estiver carregado
    return localStorage.getItem('user_role') || null;
  });

  // Função para obter um token válido
  const getValidToken = async (): Promise<string> => {
    if (!user.value) throw new Error('Usuário não autenticado');

    const now = Math.floor(Date.now() / 1000);

    if (!currentToken.value || !tokenExpiry.value || tokenExpiry.value - now < 300) {
      try {
        const token = await user.value.getIdToken(true);
        currentToken.value = token;

        const decodedToken = jwtDecode<TokenData>(token);
        tokenExpiry.value = decodedToken.exp;

        return token;
      } catch (error) {
        console.error('Erro ao obter novo token:', error);
        throw new Error('Falha ao renovar o token de autenticação');
      }
    }

    return currentToken.value;
  };

  // Configuração de interceptor Axios
  const setupAxiosInterceptors = () => {
    // Remove interceptor anterior se existir
    if (requestInterceptorId !== null) {
      axios.interceptors.request.eject(requestInterceptorId);
    }

    // Adiciona novo interceptor e guarda seu ID
    requestInterceptorId = axios.interceptors.request.use(async (config) => {
      if (user.value) {
        try {
          const token = await getValidToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Erro no interceptor:', error);
        }
      }
      return config;
    });
  };

  const login = async (email: string, password: string) => {
    try {
      // Configurar persistência para LOCAL
      await setPersistence(auth, browserLocalPersistence);

      // Autenticação no Firebase
      const res = await signInWithEmailAndPassword(auth, email, password);
      user.value = res.user;

      // Obter token para requisição
      const token = await getValidToken();

      // Buscar perfil do usuário
      const response = await axios.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Armazenar dados do perfil na memória
      perfil.value = response.data.perfil;

      // Salvar a role no localStorage (mais duradouro que sessionStorage)
      const userRole = response.data.perfil?.role || '';
      localStorage.setItem('user_role', userRole);

      // Configurar interceptor para requisições futuras
      setupAxiosInterceptors();

      return response.data;
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/user-not-found':
            throw new Error('E-mail não encontrado.');
          case 'auth/invalid-credential':
            throw new Error('Email ou Senha Incorretos.');
          case 'auth/too-many-requests':
            throw new Error('Muitas tentativas. Tente novamente em breve.');
          default:
            console.error('Erro Firebase:', err.code, err.message);
            throw new Error('Erro ao fazer login. Tente novamente.');
        }
      }

      console.error('Erro não identificado no login:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar dados mesmo se o signOut falhar
      user.value = null;
      perfil.value = null;
      currentToken.value = '';
      tokenExpiry.value = 0;

      // Limpar dados armazenados
      localStorage.removeItem('user_role');
    }
  };

  const refreshUserProfile = async () => {
    if (!user.value) return null;

    try {
      const token = await getValidToken();
      const response = await axios.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      perfil.value = response.data.perfil;

      // Atualizar o role no localStorage
      if (perfil.value?.role) {
        localStorage.setItem('user_role', perfil.value.role);
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
  };

  const initAuth = async () => {
    console.log('Iniciando autenticação...');
    loading.value = true;

    try {
      // Garantir que a persistência seja LOCAL
      await setPersistence(auth, browserLocalPersistence);

      // Verificar se há role salva
      const savedRole = localStorage.getItem('user_role');

      if (savedRole) {
        console.log('Role recuperada do storage:', savedRole);
        // Criar um perfil temporário com a role
        perfil.value = { role: savedRole };
      }

      const authInstance = getAuth();

      // Verificação síncrona rápida (não confiável, apenas para UI inicial)
      const currentUser = authInstance.currentUser;
      if (currentUser) {
        console.log('Usuário já autenticado (verificação rápida):', currentUser.email);
        user.value = currentUser;
        setupAxiosInterceptors();
      }

      // Promise para aguardar a inicialização completa do Firebase Auth
      const authStatePromise = new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
          console.log('Estado de autenticação alterado:', firebaseUser?.email || 'Sem usuário');
          unsubscribe(); // Desinscrever após a primeira chamada

          if (firebaseUser) {
            // Usuário logado no Firebase
            user.value = firebaseUser;

            try {
              // Recuperar perfil do backend
              await refreshUserProfile();
              setupAxiosInterceptors();
            } catch (error) {
              console.error('Erro ao recuperar perfil no initAuth:', error);

              // Análise segura do erro
              if (
                error &&
                typeof error === 'object' &&
                'response' in error &&
                error.response &&
                typeof error.response === 'object' &&
                'status' in error.response &&
                error.response.status === 401
              ) {
                console.warn('Sessão expirada ou inválida, fazendo logout');
                await logout();
              }
            }
          } else {
            // Firebase não tem sessão ativa
            // Mas mantemos o perfil se tiver role no localStorage
            if (!savedRole) {
              user.value = null;
              perfil.value = null;
              currentToken.value = '';
              tokenExpiry.value = 0;
            }
          }

          resolve();
        });
      });

      // Aguardar a inicialização completa
      await authStatePromise;

      // Configurar listener permanente para mudanças de estado
      onAuthStateChanged(authInstance, async (firebaseUser) => {
        console.log('Mudança de estado de autenticação:', firebaseUser?.email || 'Sem usuário');

        if (firebaseUser) {
          user.value = firebaseUser;

          if (!perfil.value) {
            try {
              await refreshUserProfile();
            } catch (error) {
              console.error('Erro ao atualizar perfil após mudança de estado:', error);
            }
          }
        } else {
          // Se não houver role salva, limpar tudo
          if (!localStorage.getItem('user_role')) {
            user.value = null;
            perfil.value = null;
          }
        }
      });
    } catch (error) {
      console.error('Erro durante inicialização de autenticação:', error);
    } finally {
      loading.value = false;
      authInitialized.value = true;
    }
  };

  return {
    user,
    perfil,
    loading,
    authInitialized,
    isAuthenticated,
    getRole,
    login,
    logout,
    initAuth,
    refreshUserProfile,
    getValidToken,
  };
});
