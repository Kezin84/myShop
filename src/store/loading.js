// src/stores/loading.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(false)

  const start = () => (loading.value = true)
  const stop = () => (loading.value = false)

  const wait = async (ms = 2000) => {
    start()
    await new Promise(resolve => setTimeout(resolve, ms))
    stop()
  }

  return { loading, start, stop, wait }
})
