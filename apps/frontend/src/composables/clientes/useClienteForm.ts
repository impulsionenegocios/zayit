// src/composables/clientes/useClienteForm.ts
import { useForm, useField } from 'vee-validate'
import { ref } from 'vue'
import { criarCliente, atualizarCliente, getClientePorId } from '@/services/clienteService'
import { useToast } from '@/composables/useToast'

export function useClienteForm(idCliente?: string) {
  const toast = useToast()
  const carregando = ref(false)

  const { handleSubmit, setValues, resetForm } = useForm()

  const {
    value: name,
    errorMessage: nameError,
    handleBlur: blurName,
    meta: nameMeta,
  } = useField<string>('name', 'required')

  const {
    value: email,
    errorMessage: emailError,
    handleBlur: blurEmail,
    meta: emailMeta,
  } = useField<string>('email', 'required|email')

  const {
    value: password,
    errorMessage: passwordError,
    handleBlur: blurPassword,
    meta: passwordMeta,
  } = useField<string>('password', idCliente ? '' : 'required|min:6')

  const { value: logo } = useField<File | null>('logo')

  async function carregarClienteParaEdicao() {
    if (!idCliente) return

    carregando.value = true
    try {
      const res = await getClientePorId(idCliente)
      const cliente = res.data
      setValues({
        name: cliente.name,
        email: cliente.email,
        password: '', // não retornamos senha
        logo: null,
      })
    } catch (error) {
      toast.error('Erro ao carregar cliente.')
    } finally {
      carregando.value = false
    }
  }

  const salvar = handleSubmit(async (values) => {
    const data = new FormData()
    data.append('name', values.name)
    data.append('email', values.email)
    if (values.password) data.append('password', values.password)
    data.append('role', 'company')
    if (values.logo) data.append('logo', values.logo)

    try {
      if (idCliente) {
        await atualizarCliente(idCliente, data)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await criarCliente(data)
        toast.success('Cliente criado com sucesso!')
        resetForm()
      }
    } catch (error) {
      toast.error('Erro ao salvar cliente.')
      console.error(error)
    }
  })

  return {
    name, nameError, blurName, nameMeta,
    email, emailError, blurEmail, emailMeta,
    password, passwordError, blurPassword, passwordMeta,
    logo, salvar, carregarClienteParaEdicao, carregando,
  }
}
