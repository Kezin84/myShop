<template>
    <div class="container py-5">
      <h3 class="mb-4 fw-bold">📝 Đăng ký</h3>
      <form @submit.prevent="handleRegister" class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Tên đăng nhập</label>
          <input v-model="username" required class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Mật khẩu</label>
          <input v-model="password" required type="password" class="form-control" />
        </div>
        <div class="col-12">
          <button class="btn btn-success px-4">Đăng ký</button>
          <RouterLink to="/login" class="btn btn-link">Đã có tài khoản?</RouterLink>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const username = ref('')
  const password = ref('')
  const router = useRouter()
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec'
  
  const handleRegister = async () => {
    const formData = new FormData()
    formData.append('action', 'registerUser')
    formData.append('username', username.value)
    formData.append('password', password.value)
  
    const res = await axios.post(SCRIPT_URL, formData)
    const data = res.data
  
    if (data.error) {
      alert(data.message)
    } else {
      alert('Đăng ký thành công!')
      router.push('/login')
    }
  }
  </script>
  