<template>
    <div class="card shadow-sm border rounded p-3 h-100">
      <img :src="product['ẢNH(URL)']" class="img-fluid mb-2" style="height: 150px; object-fit: cover;" />
      <h6 class="fw-bold">{{ product['TÊN SẢN PHẨM'] }}</h6>
      <p class="text-danger fw-bold">{{ formatCurrency(product['GIÁ']) }}</p>
      <RouterLink :to="`/product/${product.ID}`" class="btn btn-sm btn-primary">Xem chi tiết</RouterLink>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  import { RouterLink } from 'vue-router'
  
  const props = defineProps({
    product: Object
  })
  
  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString() + '₱'
  }
  </script>
  
  <style scoped>
  .card {
    transition: transform 0.2s;
  }
  .card:hover {
    transform: scale(1.02);
  }
  </style>
  