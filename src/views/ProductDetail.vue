<template>
    <div class="container py-4">
      <div v-if="product">
        <div class="row align-items-start">
          <!-- ẢNH -->
          <div class="col-md-6 mb-4">
            <img
              :src="product['ẢNH(URL)']"
              class="img-fluid rounded border shadow-sm"
              style="max-height: 420px; object-fit: cover;"
              alt="Ảnh sản phẩm"
            />
          </div>
  
          <!-- THÔNG TIN -->
          <div class="col-md-6">
            <h3 class="fw-bold text-uppercase text-dark mb-2">{{ product['TÊN SẢN PHẨM'] }}</h3>
            <p class="fs-4 fw-bold text-danger mb-2">{{ product['GIÁ'] }}₱</p>
            <p class="text-secondary mb-4">{{ product['MÔ TẢ'] }}</p>
  
            <label class="form-label fw-semibold text-dark">Số lượng:</label>
            <div class="d-flex align-items-center gap-2 mb-2">
              <button class="btn btn-outline-secondary btn-sm" @click="decreaseQty">-</button>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model.number="quantity"
                :max="maxQty"
                :min="1"
                style="width: 60px; text-align: center;"
              />
              <button class="btn btn-outline-secondary btn-sm" @click="increaseQty">+</button>
            </div>
            <p class="text-muted small">Còn lại: {{ product['SỐ LƯỢNG'] }}</p>
  
            <button
              v-if="product['SỐ LƯỢNG'] > 0"
              class="btn btn-warning fw-bold mt-3 px-4"
              @click="addToCart"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              v-else
              class="btn btn-secondary mt-3 px-4"
              disabled
            >
              Sản phẩm tạm hết hàng
            </button>
          </div>
        </div>
      </div>
  
      <div v-else class="text-center py-5">
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const quantity = ref(1)

const user = JSON.parse(localStorage.getItem('user')) || {}
const username = user.username || ''

const increaseQty = () => {
  if (quantity.value < product.value['SỐ LƯỢNG']) {
    quantity.value++
  }
}

const decreaseQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (!username) {
    alert('Bạn cần đăng nhập để thêm vào giỏ hàng!')
    return router.push('/login')
  }

  const cartKey = `cart_${username}`
  let cart = JSON.parse(localStorage.getItem(cartKey)) || []

  const newItem = {
    ID: product.value['ID'],
    'TÊN SẢN PHẨM': product.value['TÊN SẢN PHẨM'],
    'GIÁ': product.value['GIÁ'],
    'ẢNH(URL)': product.value['ẢNH(URL)'],
    quantity: quantity.value
  }

  const existingIndex = cart.findIndex(item => item.ID === newItem.ID)
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity.value
  } else {
    cart.push(newItem)
  }

  localStorage.setItem(cartKey, JSON.stringify(cart))
  alert('✅ Đã thêm vào giỏ hàng!')
  router.push('/cart')
}

onMounted(async () => {
  const id = route.params.id
  const res = await axios.get(`https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec?action=getProductById&id=${id}`)
  product.value = res.data
})

watch(quantity, (newVal) => {
  if (!product.value) return
  if (newVal > product.value['SỐ LƯỢNG']) {
    quantity.value = product.value['SỐ LƯỢNG']
  }
  if (newVal < 1) {
    quantity.value = 1
  }
})

const maxQty = computed(() => product.value?.['SỐ LƯỢNG'] || 1)
</script>


  