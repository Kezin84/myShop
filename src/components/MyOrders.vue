<template>
  <div class="container py-4">
    <h3 class="fw-bold mb-4">🗓️ Đơn hàng của bạn</h3>

    <div class="mb-3 d-flex gap-4 align-items-center">
      <div>
        <label class="me-2 fw-bold">📦 Trạng thái:</label>
        <select v-model="selectedStatus" class="form-select d-inline w-auto">
          <option value="">-- Tất cả --</option>
          <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>
      <div>
        <label class="me-2 fw-bold">🕒 Sắp xếp:</label>
        <select v-model="sortOption" class="form-select d-inline w-auto">
          <option value="moinhat">🔽 Mới nhất</option>
          <option value="cunhat">🔼 Cũ nhất</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="filteredOrders.length === 0">
      <p class="text-muted">Không có đơn hàng phù hợp.</p>
    </div>

    <div class="row g-3" v-else>
      <div class="col-12" v-for="(order, index) in filteredOrders" :key="index">
        <div class="border rounded p-3 shadow-sm bg-white h-100">
          <h6 class="fw-bold text-purple mb-2">🆔 Mã đơn: {{ order.id }}</h6>
          <p><strong>🙍‍♂️ Tên Khách:</strong> {{ order.username }}</p>
          <p><strong>📍 Địa chỉ:</strong> {{ order.address }}</p>
          <p><strong>📞 SĐT:</strong> {{ order.phone }}</p>
          <p><strong>🛒 Sản phẩm:</strong> {{ order.products }}</p>
          <p class="fw-bold text-danger">💰 Tổng tiền: {{ formatCurrency(order.total) }}</p>
          <p class="text-muted mb-1">🕒 Ngày: {{ order.date }}</p>
          <p class="mb-0">
            📌 Trạng thái:
            <span
              :class="{
                'text-success': order.status === 'ĐÃ HOÀN THÀNH',
                'text-danger': order.status === 'ĐÃ BỊ HUỶ',
                'text-primary': order.status === 'ĐANG XỬ LÝ'
              }"
              class="fw-bold"
            >
              {{ order.status }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec'

const orders = ref([])
const loading = ref(true)
const selectedStatus = ref('ĐÃ HOÀN THÀNH')
const sortOption = ref('moinhat')

// ✅ Parse format "HH:mm:ss DD/MM/YYYY"
const toTimestamp = (str) => {
  try {
    if (!str) return 0
    const [time, date] = str.trim().split(' ')
    const [hour, minute, second] = time.split(':').map(Number)
    const [day, month, year] = date.split('/').map(Number)
    return new Date(year, month - 1, day, hour, minute, second).getTime()
  } catch {
    return 0
  }
}

// Trạng thái duy nhất
const uniqueStatuses = computed(() => {
  const set = new Set()
  orders.value.forEach(o => set.add(o.status?.trim() || 'ĐANG XỬ LÝ'))
  return Array.from(set)
})

// Lọc và sắp xếp
const filteredOrders = computed(() => {
  let result = orders.value.map(o => ({
    ...o,
    status: o.status?.trim() || 'ĐANG XỬ LÝ',
    timestamp: toTimestamp(o.date)
  }))

  if (selectedStatus.value) {
    result = result.filter(o => o.status === selectedStatus.value)
  }

  result.sort((a, b) =>
    sortOption.value === 'moinhat'
      ? b.timestamp - a.timestamp
      : a.timestamp - b.timestamp
  )

  return result
})

const formatCurrency = (val) => {
  return Number(val || 0).toLocaleString() + '₱'
}

onMounted(async () => {
  const saved = localStorage.getItem('user')
  if (!saved) return
  const { username } = JSON.parse(saved)

  try {
    const res = await axios.get(SCRIPT_URL, {
      params: {
        action: 'getOrdersByUser',
        user: username
      }
    })
    orders.value = res.data
  } catch (err) {
    console.error('Lỗi khi lấy đơn hàng:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.text-purple {
  color: purple;
}
</style>
