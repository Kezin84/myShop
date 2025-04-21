<template>
  <div class="container py-4">
    <h3 class="fw-bold mb-4">🛠 Quản lý sản phẩm</h3>

    <!-- FORM -->
    <div class="card shadow-sm mb-4">
      <div class="card-header fw-bold text-primary">
        {{ isEditing ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Tên sản phẩm</label>
              <input v-model="form['TÊN SẢN PHẨM']" class="form-control" required />
            </div>
            <div class="col-md-3">
              <label class="form-label">Giá</label>
              <input v-model.number="form['GIÁ']" type="number" class="form-control" required />
            </div>
            <div class="col-md-3">
              <label class="form-label">Tồn kho</label>
              <input v-model.number="form['SỐ LƯỢNG']" type="number" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Mô tả</label>
              <input v-model="form['MÔ TẢ']" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Link ảnh</label>
              <input v-model="form['ẢNH(URL)']" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Danh mục</label>
              <input v-model="form['DANH MỤC']" class="form-control" />
            </div>
          </div>
          <div class="mt-3 d-flex gap-2">
            <button type="submit" class="btn btn-primary fw-bold">
              {{ isEditing ? '💾 Lưu thay đổi' : '➕ Thêm sản phẩm' }}
            </button>
            <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-secondary">
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="d-flex gap-3 mb-3 align-items-center">
      <input v-model="searchQuery" class="form-control w-50" placeholder="🔍 Tìm theo tên hoặc ID..." />
      <select v-model="sortOption" class="form-select w-auto">
        <option value="">SẮP XẾP : TẤT CẢ</option>
        <option v-for="cat in categories" :key="cat" :value="cat">📁 {{ cat }}</option>
        <option value="hethang">❌ Hết hàng</option>
      </select>
    </div>

    <!-- TABLE -->
    <div v-if="filteredProducts.length === 0" class="text-muted">Không có sản phẩm phù hợp.</div>
    <table v-else class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Giá</th>
          <th>Danh mục</th>
          <th>Ảnh</th>
          <th>Tồn</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredProducts" :key="index">
          <td>{{ item.ID }}</td>
          <td>{{ item['TÊN SẢN PHẨM'] }}</td>
          <td>{{ item['GIÁ'] }}</td>
          <td>{{ item['DANH MỤC'] }}</td>
          <td>
            <img :src="item['ẢNH(URL)']" width="40" height="40" style="object-fit: cover; border-radius: 5px" />
          </td>
          <td>{{ item['SỐ LƯỢNG'] }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" @click="edit(item)">Sửa</button>
            <button class="btn btn-sm btn-danger" @click="remove(item.ID)">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const products = ref([])
const categories = ref([])
const searchQuery = ref('')
const sortOption = ref('')
const isEditing = ref(false)

const form = ref({
  ID: '',
  'TÊN SẢN PHẨM': '',
  'GIÁ': '',
  'MÔ TẢ': '',
  'ẢNH(URL)': '',
  'DANH MỤC': '',
  'SỐ LƯỢNG': 0
})

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9PtKQU7BwVz6jD3I4j-SjBJP7zQWJi-ORmex0YAxsdYB6ZeMrZPdtvhnfjeflfy7GRw/exec'

const fetchData = async () => {
  const res = await axios.get(`${SCRIPT_URL}?action=getProducts`)
  products.value = res.data

  // Tự động lấy danh mục duy nhất
  const danhMucSet = new Set()
  res.data.forEach(p => {
    if (p['DANH MỤC']) danhMucSet.add(p['DANH MỤC'])
  })
  categories.value = Array.from(danhMucSet)
}

const handleSubmit = async () => {
  const action = isEditing.value ? 'updateProduct' : 'addProduct'
  const payload = new FormData()
  if (isEditing.value) payload.append('id', form.value.ID)
  payload.append('action', action)
  Object.entries(form.value).forEach(([k, v]) => payload.append(k, v))
  await axios.post(SCRIPT_URL, payload)
  await fetchData()
  resetForm()
}

const resetForm = () => {
  form.value = {
    ID: '',
    'TÊN SẢN PHẨM': '',
    'GIÁ': '',
    'MÔ TẢ': '',
    'ẢNH(URL)': '',
    'DANH MỤC': '',
    'SỐ LƯỢNG': 0
  }
  isEditing.value = false
}

const edit = (item) => {
  form.value = { ...item }
  isEditing.value = true
}

const remove = async (id) => {
  if (confirm('Bạn có chắc muốn xoá?')) {
    const payload = new FormData()
    payload.append('action', 'deleteProduct')
    payload.append('id', id)
    await axios.post(SCRIPT_URL, payload)
    await fetchData()
  }
}

const filteredProducts = computed(() => {
  let list = [...products.value]
  const q = searchQuery.value.toLowerCase()

  if (q) {
    list = list.filter(p =>
      p['TÊN SẢN PHẨM'].toLowerCase().includes(q) || p.ID.toLowerCase().includes(q)
    )
  }

  if (sortOption.value === 'hethang') {
    list = list.filter(p => Number(p['SỐ LƯỢNG']) === 0)
  } else if (sortOption.value && categories.value.includes(sortOption.value)) {
    list = list.filter(p => p['DANH MỤC'] === sortOption.value)
  }

  return list
})

onMounted(fetchData)
</script>

<style scoped>
img {
  border-radius: 5px;
}
</style>
