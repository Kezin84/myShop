<template>
  <div class="container py-4">
    <h3 class="fw-bold mb-4">✨ Tra cứu đơn hàng</h3>

    <div class="mb-3 row g-2 align-items-center">
      <div class="col-auto">
        <input
          v-model="phone"
          type="text"
          class="form-control"
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="fetchOrders">Tra cứu</button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="orders.length === 0 && searched">
      <p class="text-muted">Không tìm thấy đơn hàng nào.</p>
    </div>

    <div v-else>
      <div
        v-for="(order, index) in orders"
        :key="index"
        class="card mb-3 shadow-sm"
      >
        <div class="card-body">
          <h6 class="fw-bold">🆔 Mã đơn: {{ order[0] }}</h6>
          <p class="mb-1">👤 Người mua: {{ order[1] }}</p>
          <p class="mb-1">📍 Địa chỉ: {{ order[2] }}</p>
          <p class="mb-1">📞 SĐT: {{ order[3] }}</p>
          <p class="mb-1">🛒 Sản phẩm: {{ order[4] }}</p>
          <p class="mb-1 fw-bold text-danger">💰 Tổng tiền: {{ order[5] }}₱</p>
          <p class="mb-1 text-muted">🕒 Ngày: {{ order[6] }}</p>
          <p class="mb-1">
            📌 Trạng thái:
            <span
              :class="{
                'text-success': order[7] === 'ĐÃ HOÀN THÀNH',
                'text-danger': order[7] === 'ĐÃ BỊ HUỶ',
                'text-primary': !order[7]
              }"
              class="fw-bold"
            >
              {{ order[7] || 'ĐANG XỬ LÝ' }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const phone = ref('')
const orders = ref([])
const loading = ref(false)
const searched = ref(false)

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec'

const fetchOrders = async () => {
  if (!phone.value) return alert('Nhập số điện thoại!')

  loading.value = true
  searched.value = false
  orders.value = []

  try {
    const res = await axios.get(SCRIPT_URL, {
      params: {
        action: 'getOrdersByPhone',
        phone: phone.value
      }
    })
    orders.value = res.data
    searched.value = true
  } catch (err) {
    alert('Lỗi khi tra cứu!')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input.form-control {
  width: 250px;
}
</style>
