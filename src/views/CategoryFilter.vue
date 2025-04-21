<template>
  <div class="container py-3">
    <h4 class="mb-3">
      📁 Danh mục: <strong>{{ currentCategory }}</strong>
    </h4>

    <!-- BỘ LỌC SẮP XẾP -->
    <div class="d-flex justify-content-end mb-3">
      <label class="me-2 fw-bold">Sắp xếp:</label>
      <select v-model="sortOption" @change="sortProducts" class="form-select w-auto">
        <option value="">-- Chọn --</option>
        <option value="name-asc">Tên A-Z</option>
        <option value="name-desc">Tên Z-A</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
      </select>
    </div>

    <!-- DANH SÁCH SẢN PHẨM -->
    <div class="row">
      <div class="col-md-3 mb-4" v-for="product in sortedProducts" :key="product.ID">
        <RouterLink :to="`/product/${product.ID}`" class="text-decoration-none text-dark">
          <div class="card h-100 shadow-sm">
            <img :src="product['ẢNH(URL)']" class="card-img-top" height="250" style="object-fit: cover" />
            <div class="card-body">
              <h6 class="fw-bold text-uppercase">{{ product['TÊN SẢN PHẨM'] }}</h6>
              <p class="text-danger fw-bold">{{ product['GIÁ'] }}P</p>
              <p class="small text-muted">{{ product['MÔ TẢ'] }}</p>
              <p class="small">Kho: {{ product['SỐ LƯỢNG'] }}</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const products = ref([])
const sortedProducts = ref([])
const route = useRoute()
const currentCategory = ref('TẤT CẢ')
const sortOption = ref('')

const fetchProducts = async () => {
  const res = await axios.get(
    'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec?action=getProducts'
  )
  const all = res.data
  const cat = route.params.cat || 'TẤT CẢ'
  currentCategory.value = cat
  products.value = cat === 'TẤT CẢ' ? all : all.filter(p => p['DANH MỤC'] === cat)
  sortProducts()
}

const sortProducts = () => {
  const sorted = [...products.value]
  switch (sortOption.value) {
    case 'name-asc':
      sorted.sort((a, b) => a['TÊN SẢN PHẨM'].localeCompare(b['TÊN SẢN PHẨM']))
      break
    case 'name-desc':
      sorted.sort((a, b) => b['TÊN SẢN PHẨM'].localeCompare(a['TÊN SẢN PHẨM']))
      break
    case 'price-asc':
      sorted.sort((a, b) => Number(a['GIÁ']) - Number(b['GIÁ']))
      break
    case 'price-desc':
      sorted.sort((a, b) => Number(b['GIÁ']) - Number(a['GIÁ']))
      break
  }
  sortedProducts.value = sorted
}

watch(() => route.params.cat, fetchProducts)
onMounted(fetchProducts)
</script>

<style scoped>
.card {
  transition: 0.2s;
}
.card:hover {
  transform: scale(1.01);
}
</style>
