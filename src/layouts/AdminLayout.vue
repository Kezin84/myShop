<template>
    <div class="admin-layout d-flex">
      <aside class="sidebar bg-dark text-white p-3">
        <h5 class="fw-bold text-center mb-4">🔐 Admin Panel</h5>
        <RouterLink to="/manage-orders" class="d-block mb-2">📦 Đơn hàng</RouterLink>
        <RouterLink to="/admin" class="d-block mb-2">📋 Sản phẩm</RouterLink>
        <RouterLink to="/admin-users" class="d-block mb-2">👥 Người dùng</RouterLink>
        <RouterLink to="/admin-stats" class="d-block mb-2">📊 Thống kê</RouterLink>
        <RouterLink to="/orders" class="d-block mb-2">🔍 Tra cứu đơn</RouterLink>
        <button class="btn btn-sm btn-danger mt-3 w-100" @click="logout">Đăng xuất</button>
      </aside>
  
      <main class="flex-grow-1 p-4 bg-light">
        <RouterView />
      </main>
    </div>
  </template>
  
  <script setup>
  import { RouterView, RouterLink, useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  
  const router = useRouter()
  const logout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }
  </script>
  
  <style scoped>
  .admin-layout {
    min-height: 100vh;
  }
  .sidebar {
    width: 220px;
    min-height: 100vh;
  }
  .sidebar a {
    color: white;
    text-decoration: none;
    padding: 8px;
    border-radius: 4px;
    transition: background 0.3s;
  }
  .sidebar a:hover {
    background-color: #495057;
  }
  main {
    overflow-x: hidden;
  }
  @media (max-width: 768px) {
    .admin-layout {
      flex-direction: column;
    }
    .sidebar {
      width: 100%;
      text-align: center;
    }
    .sidebar a {
      display: inline-block;
      margin: 4px;
    }
  }
  </style>