// src/composables/clientes/useClienteForm.ts
import { useForm, useField } from 'vee-validate'
import { ref, Ref } from 'vue'
import { criarCliente, atualizarCliente, getClientePorId } from '@/services/clienteService'
import { useToast } from '@/composables/useToast'

export function useClienteForm(idCliente?: string, fileInputRef?: Ref<any>) {
  const toast = useToast()
  const carregando = ref(false)
  const logoRemovida =  ref(false)
  // guarda apenas a URL da logo existente (string) ou null
  const existingLogoUrl = ref<string | null>(null)
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

  // este é o File que o usuário selecionar; começa sempre em null
  const { value: logo } = useField<File | null>('logo')

  // Carrega os dados do cliente e preenche os campos (menos o logo, que só define a URL)
  async function carregarClienteParaEdicao() {
    if (!idCliente) return

    carregando.value = true
    try {
      const res = await getClientePorId(idCliente)
      const cliente = res.data

      // preenche somente name, email e zera password
      setValues({
        name: cliente.name,
        email: cliente.email,
        password: '',
      })

      // guarda a URL da logo para preview
      existingLogoUrl.value = cliente.logo_url || null
    } catch (error) {
      toast.error('Erro ao carregar cliente.')
      console.error(error)
    } finally {
      carregando.value = false
    }
  }

  // Limpa a URL antiga (quando o usuário clica em “remover” no componente)
  function removeExistingLogo() {
    existingLogoUrl.value = null
    logoRemovida.value = true
  }

  const salvar = handleSubmit(async (values) => {
    const data = new FormData()
    data.append('name', values.name)
    data.append('email', values.email)
    if (values.password) data.append('password', values.password)
    data.append('role', 'company')
    // se o usuário escolheu um novo File, inclui no FormData
    if (values.logo) {
      data.append('logo', values.logo)
      logoRemovida.value = false 
    } else if (logoRemovida.value) {
      // Usuário removeu a logo e não enviou outra
      data.append('remover_logo', 'true')
    }

    carregando.value = true
    try {
      if (idCliente) {
        await atualizarCliente(idCliente, data)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await criarCliente(data)
        toast.success('Cliente criado com sucesso!')

        resetForm()
        existingLogoUrl.value = null
        logoRemovida.value = false
        logo.value = null
        fileInputRef?.value?.resetarInput()
      }
    } catch (error) {
      toast.error('Erro ao salvar cliente.')
      console.error(error)
    } finally {
      carregando.value = false
    }
  })

  return {
    // campos do formulário
    name, nameError, blurName, nameMeta,
    email, emailError, blurEmail, emailMeta,
    password, passwordError, blurPassword, passwordMeta,
    logo,

    // preview da logo atual
    existingLogoUrl,
    removeExistingLogo,

    // ações
    salvar,
    carregarClienteParaEdicao,
    carregando,
  }
}
