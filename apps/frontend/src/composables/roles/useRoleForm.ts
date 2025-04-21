// src/composables/roles/useRoleForm.ts
import { useForm, useField } from 'vee-validate';
import { ref, Ref } from 'vue';
import { criarRole, atualizarRole, getRolePorId } from '@/services/rolesService';
import { useToast } from '@/composables/useToast';

export function useRoleForm(idRole?: string) {
  const toast = useToast();
  const carregando = ref(false);
  const { handleSubmit, setValues, resetForm } = useForm();
  const {
    value: name,
    errorMessage: nameError,
    handleBlur: blurName,
    meta: nameMeta,
  } = useField<string>('name', 'required');

  async function carregarRoleParaEdicao() {
    if (!idRole) return;

    carregando.value = true;
    try {
      const res = await getRolePorId(idRole);
      const role = res.data;

      // preenche somente name, email e zera password
      setValues({
        name: role.name,
      });
    } catch (error) {
      toast.error('Erro ao carregar a role.');
      console.error(error);
    } finally {
      carregando.value = false;
    }
  }

  const salvar = handleSubmit(async (values) => {
    const payload = {
      name: values.name,
    };

    carregando.value = true;
    try {
      if (idRole) {
        await atualizarRole(idRole, payload);
        toast.success('Role atualizado com sucesso!');
      } else {
        await criarRole(payload);
        toast.success('Role criado com sucesso!');

        resetForm();
      }
    } catch (error) {
      toast.error('Erro ao salvar a role.');
      console.error(error);
    } finally {
      carregando.value = false;
    }
  });

  return {
    // campos do formulário
    name,
    nameError,
    blurName,
    nameMeta,
    // ações
    salvar,
    carregando,
    carregarRoleParaEdicao,
  };
}
