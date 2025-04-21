<template>
  <div class="container py-5">
    <h3 class="mb-4 fw-bold">🔐 Đăng nhập</h3>
    <form @submit.prevent="handleLogin" class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Tên đăng nhập</label>
        <input v-model="username" required class="form-control" />
      </div>
      <div class="col-md-6">
        <label class="form-label">Mật khẩu</label>
        <input v-model="password" required type="password" class="form-control" />
      </div>
      <div class="col-12">
        <button class="btn btn-primary px-4">Đăng nhập</button>
        <RouterLink to="/register" class="btn btn-link">Chưa có tài khoản?</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec'

const handleLogin = async () => {
  try {
    const res = await axios.get(`${SCRIPT_URL}?action=getUsers`)
    const users = res.data

    const user = users.find(u =>
      u['tên đăng nhập']?.toString().trim() === username.value.trim() &&
      u['password']?.toString().trim() === password.value.trim()
    )

    if (user) {
      const loginData = {
        username: user['tên đăng nhập'],
        role: user['vai trò']
      }

      // Lưu vào localStorage và store
      localStorage.setItem('user', JSON.stringify(loginData))
      userStore.setUser(loginData)

      alert('✅ Đăng nhập thành công!')
      router.push('/')
    } else {
      alert('❌ Sai tên đăng nhập hoặc mật khẩu!')
    }
  } catch (err) {
    console.error('Lỗi kết nối:', err)
    alert('Lỗi khi kết nối tới server.')
  }
}
</script>
