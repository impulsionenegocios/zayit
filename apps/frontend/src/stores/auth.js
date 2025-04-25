// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, getAuth, } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import axios from '@/lib/axios';
import { auth } from '@/firebase';
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const perfil = ref(null);
    const loading = ref(true);
    const login = async (email, password) => {
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            user.value = res.user;
            const token = await res.user.getIdToken();
            const response = await axios.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            perfil.value = response.data.perfil;
        }
        catch (err) {
            if (err instanceof FirebaseError) {
                // Trate erros específicos do Firebase Auth
                switch (err.code) {
                    case 'auth/user-not-found':
                        throw new Error('E-mail não encontrado.');
                    case 'auth/invalid-credential':
                        throw new Error('Email ou Senha Incorretos.');
                    case 'auth/too-many-requests':
                        throw new Error('Muitas tentativas. Tente novamente em breve.');
                    default:
                        throw new Error('Erro ao fazer login. Tente novamente.');
                }
            }
            throw err; // se for outro tipo de erro
        }
    };
    const logout = async () => {
        await signOut(auth);
        user.value = null;
        perfil.value = null;
    };
    const initAuth = () => {
        const authInstance = getAuth();
        onAuthStateChanged(authInstance, async (firebaseUser) => {
            if (firebaseUser) {
                user.value = firebaseUser;
                try {
                    const token = await firebaseUser.getIdToken();
                    const response = await axios.get('/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    perfil.value = response.data.perfil;
                }
                catch (error) {
                    console.error('Erro ao recuperar perfil no initAuth', error);
                    await logout();
                }
            }
            loading.value = false;
        });
    };
    return {
        user,
        perfil,
        loading,
        login,
        logout,
        initAuth,
    };
}, {
    persist: true,
});
