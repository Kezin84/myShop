<template>
    <div class="mb-4 position-relative" ref="wrapper">
      <input
        v-model="keyword"
        @input="search"
        class="form-control"
        type="text"
        placeholder="Tìm theo tên/mô tả sản phẩm..."
      />
      <ul
  v-if="suggestions.length > 0"
  class="list-group position-absolute bg-white w-100 shadow-sm mt-1 z-3"
>
  <li
    class="list-group-item list-group-item-action d-flex align-items-center gap-2"
    v-for="(item, index) in suggestions"
    :key="index"
    @click="goToDetail(item.ID)"
  >
    <img :src="item['ẢNH(URL)']" alt="ảnh" width="40" height="40" style="object-fit: cover; border-radius: 5px;" />
    <div>
      <strong>{{ item['TÊN SẢN PHẨM'] }}</strong><br />
      <small class="text-muted">{{ item['GIÁ'] }}₱</small>
    </div>
  </li>
</ul>

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const keyword = ref('')
  const suggestions = ref([])
  const wrapper = ref(null)
  const allProducts = ref([])
  
  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec?action=getProducts')
      allProducts.value = res.data
    } catch (error) {
      console.error('Không thể tải sản phẩm:', error)
    }
  }
  
  const search = () => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) {
    suggestions.value = []
    return
  }

  suggestions.value = allProducts.value.filter((p) => {
    return (
      String(p['TÊN SẢN PHẨM']).toLowerCase().includes(kw) ||
      String(p['MÔ TẢ'] || '').toLowerCase().includes(kw) ||
      String(p['ID']).toLowerCase().includes(kw)
    )
  }).slice(0, 5)
}

  
  const goToDetail = (id) => {
    keyword.value = ''
    suggestions.value = []
    router.push(`/product/${id}`)
  }
  
  const handleClickOutside = (e) => {
    if (wrapper.value && !wrapper.value.contains(e.target)) {
      suggestions.value = []
    }
  }
  
  onMounted(() => {
    fetchProducts()
    document.addEventListener('click', handleClickOutside)
  })
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style scoped>
  .list-group-item {
    cursor: pointer;
  }
  </style>
  