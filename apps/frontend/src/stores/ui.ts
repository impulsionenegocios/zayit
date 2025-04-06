// stores/ui.ts
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarOpen: false,
    alert: {
      show: false,
      message: '',
      type: 'success' as 'success' | 'warning' | 'danger' | 'info',
    },
  }),
  actions: {
    showAlert(message: string, type: 'success' | 'warning' | 'danger' | 'info' = 'success') {
      this.alert = { show: true, message, type }
      setTimeout(() => (this.alert.show = false), 5000)
    },
    hideAlert() {
      this.alert.show = false
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    closeSidebar() {
      this.sidebarOpen = false
    },
    openSidebar() {
      this.sidebarOpen = true
    },
  },
})
