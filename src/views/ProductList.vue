<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-uppercase">🛒 Danh sách sản phẩm</h4>
      <select v-model="sortOption" @change="sortProducts" class="form-select w-auto fw-semibold">
        <option value="">-- Sắp xếp --</option>
        <option value="name-asc">Tên A → Z</option>
        <option value="name-desc">Tên Z → A</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
      </select>
    </div>

    <div v-if="products.length === 0">
      <p>Đang tải dữ liệu...</p>
    </div>

    <div class="product-grid">
      <div
        class="product-card"
        v-for="(product, index) in visibleProducts"
        :key="index"
        @click="goToDetail(product.ID)"
      >
        <img :src="product['ẢNH(URL)']" alt="ảnh" />
        <h6>{{ product['TÊN SẢN PHẨM'] }}</h6>
        <p class="price">{{ product['GIÁ'] }}₱</p>
        <p :class="['desc', product['SỐ LƯỢNG'] == 0 ? 'text-danger fw-semibold' : '']">
          {{ product['SỐ LƯỢNG'] == 0 ? '⛔ Sản phẩm tạm hết hàng' : product['MÔ TẢ'] }}
        </p>
        <p class="stock">Kho: {{ product['SỐ LƯỢNG'] }}</p>
      </div>
    </div>

    <div v-if="visibleCount < products.length" class="text-center mt-4">
      <button class="btn btn-outline-primary fw-bold px-4" @click="loadMore">Xem thêm</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const products = ref([])
const visibleCount = ref(20)
const sortOption = ref('')

const fetchProducts = async () => {
  const res = await axios.get(
    'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec?action=getProducts'
  )
  products.value = res.data
  sortProducts()
}

const sortProducts = () => {
  const list = [...products.value]
  switch (sortOption.value) {
    case 'name-asc':
      list.sort((a, b) => a['TÊN SẢN PHẨM'].localeCompare(b['TÊN SẢN PHẨM']))
      break
    case 'name-desc':
      list.sort((a, b) => b['TÊN SẢN PHẨM'].localeCompare(a['TÊN SẢN PHẨM']))
      break
    case 'price-asc':
      list.sort((a, b) => parseFloat(a['GIÁ']) - parseFloat(b['GIÁ']))
      break
    case 'price-desc':
      list.sort((a, b) => parseFloat(b['GIÁ']) - parseFloat(a['GIÁ']))
      break
  }
  products.value = list
}

const visibleProducts = computed(() => {
  return products.value.slice(0, visibleCount.value)
})

const loadMore = () => {
  visibleCount.value += 20
}

const goToDetail = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
}

.product-card {
  width: calc(20% - 16px);
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
}

.product-card h6 {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px;
  text-transform: uppercase;
}

.product-card .price {
  color: #d10000;
  font-weight: bold;
  font-size: 14px;
  margin: 0 0 4px;
}

.product-card .desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 4px;
}

.product-card .stock {
  font-size: 13px;
  color: #0a58ca;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 1200px) {
  .product-card {
    width: calc(25% - 16px);
  }
}

@media (max-width: 992px) {
  .product-card {
    width: calc(33.33% - 16px);
  }
}

@media (max-width: 768px) {
  .product-card {
    width: calc(50% - 16px);
  }
}

@media (max-width: 480px) {
  .product-card {
    width: 100%;
  }
}
</style>
