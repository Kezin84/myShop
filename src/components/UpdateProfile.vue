<template>
  <div class="container py-4">
    <h2 class="mb-4">Cập nhật thông tin cá nhân</h2>

    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Họ tên</label>
        <input v-model="form.hoten" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="form.email" type="email" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input v-model="form.sdt" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <input v-model="form.diachi" type="text" class="form-control" required />
      </div>

      <button type="submit" class="btn btn-primary">Cập nhật</button>
    </form>

    <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const form = ref({
  username: '',
  hoten: '',
  email: '',
  sdt: '',
  diachi: ''
})
const message = ref('')

onMounted(async () => {
  const savedUser = JSON.parse(localStorage.getItem('user'))
  if (savedUser) {
    form.value.username = savedUser.username

    // Gọi API để load thông tin KH nếu đã có
    const params = new URLSearchParams({
      action: 'getCustomerInfo',
      username: form.value.username
    })

    const res = await fetch(`https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec?${params}`)
    const data = await res.json()
    if (data.success) {
      form.value.hoten = data.hoten
      form.value.email = data.email
      form.value.sdt = data.sdt
      form.value.diachi = data.diachi
    }
  }
})

const submitForm = async () => {
  const body = new URLSearchParams({
    action: 'updateCustomerInfo',
    ...form.value
  })

  const res = await fetch('https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec', {
    method: 'POST',
    body
  })

  const data = await res.json()
  if (data.success) {
    message.value = 'Cập nhật thành công!'
  } else {
    message.value = 'Có lỗi xảy ra, vui lòng thử lại.'
  }
}

</script>
