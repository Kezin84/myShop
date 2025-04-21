import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const username = ref('')
  const role = ref('')

  const setUser = (data) => {
    isLoggedIn.value = true
    username.value = data.username
    role.value = data.role
  }

  const logout = () => {
    isLoggedIn.value = false
    username.value = ''
    role.value = ''
    localStorage.removeItem('user')
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('user')
    if (saved) {
      const user = JSON.parse(saved)
      setUser(user)
    }
  }

  return {
    isLoggedIn,
    username,
    role,
    setUser,
    logout,
    loadFromLocalStorage
  }
})
