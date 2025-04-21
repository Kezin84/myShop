<template>
    <div>
      <!-- Banner slider -->
      <div class="relative w-full h-[300px] overflow-hidden mb-6">
        <img
          v-for="(banner, index) in banners"
          :key="index"
          :src="banner"
          class="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
          :class="{ 'opacity-0': currentBanner !== index, 'opacity-100': currentBanner === index }"
        />
      </div>
  
      <!-- Sản phẩm khuyến mãi -->
      <section class="mb-8">
        <h2 class="text-xl font-bold text-center mb-4 text-red-600">
          📅 SẢN PHẨM KHUYẾN MÃI
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <ProductCard v-for="item in saleProducts" :key="item.ID" :product="item" />
        </div>
      </section>
  
      <!-- Danh mục sản phẩm -->
      <section v-for="cat in categories" :key="cat" class="mb-10">
        <h2 class="text-lg font-semibold mb-3 text-center text-gray-700 uppercase">
          {{ cat }}
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <ProductCard
            v-for="item in productsByCategory(cat)"
            :key="item.ID"
            :product="item"
          />
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import ProductCard from '@/components/ProductCard.vue'
  
  const SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec'
  
  const banners = [
    'https://cdn.yody.vn/banners/banner1.jpg',
    'https://cdn.yody.vn/banners/banner2.jpg',
    'https://cdn.yody.vn/banners/banner3.jpg',
  ]
  const currentBanner = ref(0)
  const products = ref([])
  const categories = ref([])
  
  onMounted(async () => {
    setInterval(() => {
      currentBanner.value = (currentBanner.value + 1) % banners.length
    }, 3000)
  
    const res = await axios.get(`${SCRIPT_URL}?action=getProducts`)
    products.value = res.data || []
    categories.value = [...new Set(products.value.map(p => p['DANH MỤC']).filter(Boolean))]
  })
  
  const saleProducts = computed(() =>
    products.value.filter(p => String(p['GIÁ']).length <= 6 || p['TÊN SẢN PHẨM'].includes('SALE'))
  )
  
  const productsByCategory = (cat) =>
    products.value.filter((p) => p['DANH MỤC'] === cat)
  </script>
  
  <style scoped>
  img {
    transition: opacity 1s ease-in-out;
  }
  </style>
  