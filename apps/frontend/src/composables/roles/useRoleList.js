// src/composables/roles/useRoleList.ts
import { ref } from 'vue';
import { getRoles } from '@/services/rolesService';
export function useRolesList() {
    const roles = ref([]);
    const carregando = ref(false);
    const error = ref(null);
    const fetchRoles = async () => {
        carregando.value = true;
        error.value = null;
        try {
            const res = await getRoles();
            roles.value = res.data.roles;
            return res;
        }
        catch (err) {
            console.error('Erro ao carregar as regras', err);
            error.value = err instanceof Error ? err : new Error('Erro desconhecido ao carregar roles');
            throw err;
        }
        finally {
            carregando.value = false;
        }
    };
    return {
        roles,
        carregando,
        error,
        fetchRoles,
    };
}
