// src/composables/clientes/useClienteForm.ts
import { useForm, useField } from 'vee-validate';
import { ref, onMounted } from 'vue';
import { criarCliente, atualizarCliente, getClientePorId } from '@/services/clienteService';
import { useToast } from '@/composables/useToast';
import { getRoles } from '@/services/rolesService';
import { useRouter } from 'vue-router';
export function useClienteForm(idCliente, fileInputRef) {
    const toast = useToast();
    const router = useRouter();
    const carregando = ref(false);
    const roles = ref([]);
    const existingLogoUrl = ref(null);
    const logoRemovida = ref(false);
    const { handleSubmit, setValues, resetForm } = useForm();
    const { value: name, errorMessage: nameError, handleBlur: blurName, meta: nameMeta, } = useField('name', 'required');
    const { value: email, errorMessage: emailError, handleBlur: blurEmail, meta: emailMeta, } = useField('email', 'required|email');
    const { value: password, errorMessage: passwordError, handleBlur: blurPassword, meta: passwordMeta, } = useField('password', idCliente ? '' : 'required|min:6');
    const { value: role, errorMessage: roleError, handleBlur: blurRole, meta: roleMeta, } = useField('role', 'required');
    const { value: logo } = useField('logo');
    async function carregarRoles() {
        try {
            const res = await getRoles();
            roles.value = res.data.roles.map((role) => ({
                label: role.name,
                value: role.name,
            }));
        }
        catch (error) {
            toast.error('Erro ao carregar as roles');
            console.error(error);
        }
    }
    async function carregarClienteParaEdicao() {
        if (!idCliente)
            return;
        carregando.value = true;
        try {
            const cliente = await getClientePorId(idCliente);
            setValues({
                name: cliente.name,
                email: cliente.email,
                password: '',
                role: cliente.role,
            });
            existingLogoUrl.value = cliente.logo_url || null;
        }
        catch (error) {
            toast.error('Erro ao carregar cliente.');
            console.error(error);
        }
        finally {
            carregando.value = false;
        }
    }
    function removeExistingLogo() {
        existingLogoUrl.value = null;
        logoRemovida.value = true;
    }
    function gerarFormData(values) {
        const data = new FormData();
        data.append('name', values.name);
        data.append('email', values.email);
        if (values.password)
            data.append('password', values.password);
        data.append('role', values.role);
        if (values.logo) {
            data.append('logo', values.logo);
            logoRemovida.value = false;
        }
        else if (logoRemovida.value) {
            data.append('remover_logo', 'true');
        }
        return data;
    }
    const salvar = handleSubmit(async (values) => {
        const formData = gerarFormData(values);
        carregando.value = true;
        try {
            if (idCliente) {
                await atualizarCliente(idCliente, formData);
                toast.success('Cliente atualizado com sucesso!');
            }
            else {
                await criarCliente(formData);
                toast.success('Cliente criado com sucesso!');
                resetForm();
                existingLogoUrl.value = null;
                logoRemovida.value = false;
                logo.value = null;
                fileInputRef?.value?.resetarInput();
            }
        }
        catch (error) {
            toast.error('Erro ao salvar cliente.');
            console.error(error);
        }
        finally {
            carregando.value = false;
        }
    });
    const voltar = () => {
        router.back();
    };
    onMounted(() => {
        carregarRoles();
        if (idCliente)
            carregarClienteParaEdicao();
    });
    return {
        // Campos
        name,
        nameError,
        blurName,
        nameMeta,
        email,
        emailError,
        blurEmail,
        emailMeta,
        password,
        passwordError,
        blurPassword,
        passwordMeta,
        role,
        roleError,
        blurRole,
        roleMeta,
        logo,
        // Logo existente
        existingLogoUrl,
        removeExistingLogo,
        // Ações
        salvar,
        carregarClienteParaEdicao,
        carregando,
        roles,
        voltar,
    };
}
