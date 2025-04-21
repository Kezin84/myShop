<template>
  <div class="container py-4">
    <h3 class="fw-bold mb-4">🧾 Đặt hàng</h3>

    <form @submit.prevent="submitOrder" class="row g-3">
      <div class="col-md-6">
        <label class="form-label fw-semibold">Địa chỉ nhận hàng</label>
        <input v-model="address" required class="form-control" />
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold">Số điện thoại</label>
        <input v-model="phone" required class="form-control" />
      </div>

      <div class="col-12">
        <label class="form-label fw-semibold">Sản phẩm</label>
        <ul class="list-group mb-3">
          <li
            v-for="(item, index) in cart"
            :key="index"
            class="list-group-item d-flex align-items-center gap-3"
          >
            <img :src="item['ẢNH(URL)']" alt="Ảnh sản phẩm" style="width: 60px; height: 60px; object-fit: cover;" />
            <div class="flex-grow-1">
              <div class="fw-semibold">{{ item['TÊN SẢN PHẨM'] }} x {{ item.quantity }}</div>
              <div class="text-danger fw-bold">{{ item['GIÁ'] * item.quantity }}₱</div>
            </div>
          </li>
        </ul>

        <h5 class="text-end">Tổng cộng: <span class="text-danger">{{ total }}₱</span></h5>
      </div>

      <div class="col-12 text-end">
        <button class="btn btn-success px-4">Đặt hàng</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const address = ref('')
const phone = ref('')
const cart = ref([])

const user = JSON.parse(localStorage.getItem('user')) || {}
const username = user.username || ''

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec'

onMounted(async () => {
  const cartKey = `cart_${username}`
  const stored = localStorage.getItem(cartKey)
  if (stored) {
    cart.value = JSON.parse(stored)
  }

  // Tự động điền địa chỉ + số điện thoại từ sheet KHACHHANG
  if (username) {
    try {
      const params = new URLSearchParams({
        action: 'getCustomerInfo',
        username: username
      })

      const res = await fetch(`${SCRIPT_URL}?${params}`)
      const data = await res.json()

      if (data.success) {
        address.value = data.diachi
        phone.value = data.sdt
      }
    } catch (err) {
      console.error('Không thể load thông tin KH:', err)
    }
  }
})


const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item['GIÁ'] * item.quantity, 0)
)

const submitOrder = async () => {
  if (cart.value.length === 0) {
    alert('Giỏ hàng trống!')
    return
  }

  const productList = cart.value
    .map(item => `${item.ID} – ${item['TÊN SẢN PHẨM']} x ${item.quantity}`)
    .join(', ')

  try {
    // 1. Gửi đơn hàng
    const orderPayload = {
      action: 'addOrder',
      user: username,
      name: address.value,
      phone: phone.value,
      products: productList,
      total: total.value,
      date: new Date().toLocaleString()
    }

    await axios.post(SCRIPT_URL, new URLSearchParams(orderPayload))

    // 2. Cập nhật tồn kho
    const stockPayload = {
      action: 'updateStock',
      items: JSON.stringify(
        cart.value.map(item => ({
          id: item.ID,
          quantity: item.quantity
        }))
      )
    }

    await axios.post(SCRIPT_URL, new URLSearchParams(stockPayload))

    alert('Đặt hàng thành công!')
    localStorage.removeItem('cart')
    window.location.href = '/'
  } catch (error) {
    alert('Lỗi khi đặt hàng!')
    console.error(error)
  }
}
</script>
