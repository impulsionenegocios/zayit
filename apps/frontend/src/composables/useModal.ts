import { useModalStore } from '@/stores/layout/modal'

export function useModal() {
  const store = useModalStore()

  async function open(component: any, options: {
    title?: string
    props?: Record<string, any>
    size?: 'sm' | 'md' | 'lg' | 'xl'
    persistent?: boolean
    showFooter?: boolean
  } = {}) {
    return store.open({
      component,
      ...options
    })
  }
  return {
    open,
    close: store.close,
    cancel: store.cancel,
    dismissAll: store.dismissAll,
  }
}
