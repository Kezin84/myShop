<template>
    <div class="container py-4">
      <h3 class="fw-bold mb-4">🛒 Giỏ hàng của bạn</h3>
  
      <div v-if="cart.length === 0" class="text-center text-muted">
        Giỏ hàng đang trống.
      </div>
  
      <div v-else>
        <div
  v-for="(item, index) in cart"
  :key="index"
  class="card mb-3 shadow-sm p-3"
>
  <div class="row align-items-center">
    <!-- ẢNH -->
    <div class="col-3 col-md-2">
      <img
        :src="item['ẢNH(URL)']"
        class="img-fluid rounded border"
        style="object-fit: cover; height: 100px; width: 100%;"
        alt="Ảnh sản phẩm"
      />
    </div>

    <!-- THÔNG TIN -->
    <div class="col-9 col-md-10">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <div class="me-3">
          <h6 class="fw-bold text-dark mb-1">{{ item['TÊN SẢN PHẨM'] }}</h6>
          <div class="text-danger fw-bold">
            {{ item['GIÁ'] }}₱ x {{ item.quantity }} = {{ item['GIÁ'] * item.quantity }}₱
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <!-- nút số lượng -->
          <div class="input-group input-group-sm" style="width: 110px;">
            <button class="btn btn-outline-secondary" @click="decrease(index)">-</button>
            <input
              type="number"
              class="form-control text-center"
              v-model.number="item.quantity"
              @input="validate(index)"
              min="1"
            />
            <button class="btn btn-outline-secondary" @click="increase(index)">+</button>
          </div>

          <!-- nút xoá -->
          <button class="btn btn-sm btn-outline-danger" @click="remove(index)">Xoá</button>
        </div>
      </div>
    </div>
  </div>
</div>

  
<div class="text-end mt-4">
  <h5 class="fw-bold">Tổng cộng: {{ total }}₱</h5>
  <button class="btn btn-success fw-bold mt-2" @click="goToCheckout">
    Thanh toán
  </button>
</div>

      </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const cart = ref([])
const router = useRouter()

onMounted(() => {
  const stored = localStorage.getItem('cart')
  if (stored) {
    cart.value = JSON.parse(stored)
  }
})

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item['GIÁ'] * item.quantity, 0)
)

const decrease = (index) => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--
    updateCart()
  }
}

const increase = (index) => {
  cart.value[index].quantity++
  updateCart()
}

const validate = (index) => {
  if (cart.value[index].quantity < 1) {
    cart.value[index].quantity = 1
  }
  updateCart()
}

const remove = (index) => {
  cart.value.splice(index, 1)
  updateCart()
}

const updateCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

// ✅ Bấm thanh toán → chuyển qua checkout
const goToCheckout = () => {
  router.push('/checkout')
}
</script>
