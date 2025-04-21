<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, watchEffect } from 'vue'
import ProductSearch from './components/ProductSearch.vue'
import axios from 'axios'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const router = useRouter()
const categories = ref([])
const showDropdown = ref(false)
const pendingCount = ref(0)
const showNotification = ref(false)
let previousCount = 0

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec'

onMounted(async () => {
  userStore.loadFromLocalStorage()

  if (userStore.role === 'client') {
    try {
      const check = new URLSearchParams({ action: 'getCustomerInfo', username: userStore.username })
      const res = await fetch(`${SCRIPT_URL}?${check}`)
      const data = await res.json()
      if (!data.success || !data.diachi || !data.sdt) {
        alert("⚠️ Bạn chưa cập nhật thông tin cá nhân. Vui lòng cập nhật trước khi sử dụng các chức năng khác.")
        router.push('/profile')
      }
    } catch (err) {
      console.error('Lỗi kiểm tra thông tin cá nhân:', err)
    }
  }

  try {
    const res = await axios.get(`${SCRIPT_URL}?action=getProducts`)
    const data = res.data
    const uniqueCats = [...new Set(data.map(p => p['DANH MỤC']).filter(Boolean))]
    categories.value = ['TẤT CẢ', ...uniqueCats]
  } catch (e) {
    console.error('Lỗi khi load danh mục:', e)
  }

  if (userStore.role === 'admin') {
    checkNewOrders()
    setInterval(checkNewOrders, 10000)
  }
})

const checkNewOrders = async () => {
  try {
    const res = await axios.get(`${SCRIPT_URL}?action=getAllOrders`)
    const all = res.data || []
    const pending = all.filter(o => !o.status).length
    pendingCount.value = pending
    if (pending > previousCount) {
      showNotification.value = true
      setTimeout(() => showNotification.value = false, 3000)
    }
    previousCount = pending
  } catch (e) {
    console.error('Lỗi khi kiểm tra đơn mới:', e)
  }
}

const logout = () => {
  userStore.logout()
  router.push('/')
}

const goToCategory = (cat) => {
  showDropdown.value = false
  router.push(`/category/${encodeURIComponent(cat)}`)
}
</script>

<template>
  <header class="bg-white shadow-sm py-3 mb-4 border-bottom">
    <div class="container d-flex justify-content-between align-items-center flex-wrap">
      <RouterLink to="/" class="text-decoration-none mb-2">
        <h4 class="fw-bold text-primary m-0">🔐 TechShop</h4>
        <ProductSearch />
      </RouterLink>

      <nav class="d-flex flex-wrap gap-2 align-items-center position-relative">
        <RouterLink to="/about" class="btn btn-outline-info btn-sm">Giới thiệu</RouterLink>

        <div class="dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <button class="btn btn-primary btn-sm dropdown-toggle">Sản phẩm</button>
          <ul v-if="showDropdown" class="dropdown-menu show">
            <li v-for="cat in categories" :key="cat">
              <a class="dropdown-item" @click.prevent="goToCategory(cat)">{{ cat }}</a>
            </li>
          </ul>
        </div>

        <template v-if="!userStore.isLoggedIn">
          <RouterLink to="/login" class="btn btn-outline-primary btn-sm">Đăng nhập</RouterLink>
          <RouterLink to="/register" class="btn btn-outline-secondary btn-sm">Đăng ký</RouterLink>
        </template>

        <template v-else-if="userStore.role === 'client'">
          <RouterLink to="/cart" class="btn btn-outline-success btn-sm">Giỏ hàng</RouterLink>
          <RouterLink to="/checkout" class="btn btn-outline-warning btn-sm">Đặt hàng</RouterLink>
          <RouterLink to="/my-orders" class="btn btn-outline-info btn-sm">Đơn hàng của tôi</RouterLink>
          <RouterLink to="/profile" class="btn btn-outline-secondary btn-sm">👤 Thông tin cá nhân</RouterLink>
          <span class="ms-2">👋 Xin chào, <strong>{{ userStore.username }}</strong></span>
          <button class="btn btn-sm btn-danger ms-2" @click="logout">Đăng xuất</button>
        </template>

        <template v-else-if="userStore.role === 'admin'">
          <RouterLink to="/orders" class="btn btn-outline-secondary btn-sm">Tra cứu đơn</RouterLink>
          <div class="position-relative">
            <RouterLink to="/manage-orders" class="btn btn-outline-success btn-sm">Quản lý đơn hàng</RouterLink>
            <span v-if="pendingCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ pendingCount }}
            </span>
          </div>
          <RouterLink to="/admin" class="btn btn-outline-dark btn-sm">Quản lý sản phẩm</RouterLink>
          <RouterLink to="/admin-users" class="btn btn-outline-dark btn-sm">👥 Quản lý người dùng</RouterLink>
          <RouterLink to="/admin-stats" class="btn btn-outline-dark">📊 Thống kê</RouterLink>
          <span class="ms-2">👑 Xin chào Admin, <strong>{{ userStore.username }}</strong></span>
          <button class="btn btn-sm btn-danger ms-2" @click="logout">Đăng xuất</button>
          
        </template>
      </nav>
    </div>
    
  </header>

  <div v-if="showNotification" class="toast-custom">CÓ ĐƠN HÀNG MỚI</div>

  <main class="container">
    <RouterView />
  </main>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  margin: 0;
}

main {
  min-height: 100vh;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  display: block;
  padding: 0;
  border: 1px solid #ddd;
  z-index: 10;
}

.dropdown-item {
  padding: 5px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.toast-custom {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  z-index: 9999;
  animation: fadeInOut 3s ease;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px); }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: flex-start;
  }
  nav {
    flex-wrap: wrap;
  }
}
</style>
