import { useForm, useField } from 'vee-validate';
import { ref } from 'vue';
import api from '@/lib/axios';
import { useToast } from '@/composables/useToast';

// Esse composable pode ser expandido futuramente para incluir funções de leitura e update
export function useClienteForm() {
  // Toast para exibir mensagens
  const toast = useToast();

  // Inicializa o formulário com vee-validate
  const { handleSubmit } = useForm();

  // Campos com validação
  const {
    value: name,
    errorMessage: nameError,
    handleBlur: blurName,
    meta: nameMeta,
  } = useField<string>('name', 'required');

  const {
    value: email,
    errorMessage: emailError,
    handleBlur: blurEmail,
    meta: emailMeta,
  } = useField<string>('email', 'required|email');

  const {
    value: password,
    errorMessage: passwordError,
    handleBlur: blurPassword,
    meta: passwordMeta,
  } = useField<string>('password', 'required|min:6');

  const { value: logo } = useField<File | null>('logo');

  // Lógica de envio do formulário
  const salvarCliente = handleSubmit(async (values) => {
    const data = new FormData();
    data.append('name', values.name);
    data.append('email', values.email);
    data.append('password', values.password);
    data.append('role', 'company');

    if (values.logo) {
      data.append('logo', values.logo);
    }

    try {
      const response = await api.post('/clientes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Cliente criado com sucesso!');
      console.log('Cliente criado com sucesso:', response.data);
      // Aqui você pode, por exemplo, limpar os campos ou redirecionar o usuário.
    } catch (err) {
      toast.error('Erro ao criar o cliente.');
      console.error('Erro ao criar cliente:', err);
    }
  });

  return {
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
    logo,
    salvarCliente,
  };
}
