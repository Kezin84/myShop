<template>
    <div class="invoice p-4 border rounded bg-white" style="width: 800px; margin: auto">
      <div class="text-center mb-3">
        <h4 class="fw-bold">CÔNG TY TNHH TECHSHOP</h4>
        <p class="mb-0">MST: 123456788 | ĐT: 0933511334</p>
        <p class="mb-0">Địa chỉ: TPHCM | Website: DEMOSHOP.COM</p>
      </div>
  
      <div class="d-flex justify-content-between align-items-center border-top border-bottom py-2 mb-3">
        <h5 class="fw-bold">HOÁ ĐƠN BÁN LẺ</h5>
        <div class="text-end">
          <p class="m-0">Số: <span class="text-danger fw-bold">{{ order.id }}</span></p>
          <p class="m-0">Ngày: {{ order.date }}</p>
        </div>
      </div>
  
      <div class="mb-3">
        <p class="mb-1">Họ tên khách hàng: <strong>{{ order.username }}</strong></p>
        <p class="mb-1">ĐT: <strong>{{ order.phone }}</strong> | Địa chỉ: <strong>{{ order.address }}</strong>
        </p>
      </div>
  
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên hàng hoá</th>
            <th>SL</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in parsedProducts" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td colspan="4" class="text-end fw-bold">TỔNG CỘNG</td>
            <td class="fw-bold text-danger">{{ formatCurrency(order.total) }}</td>
          </tr>
        </tbody>
      </table>
  
      <p class="mt-4"><em>Ghi chú: để trống hoặc ký tên.</em></p>
  
      <div class="d-flex justify-content-end gap-2 mt-3">
        <button class="btn btn-outline-primary" @click="exportToPDF">Xuất PDF</button>
        <button class="btn btn-outline-success" @click="exportToExcel">Xuất Excel</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { toRaw } from 'vue'
  import * as XLSX from 'xlsx'
  import html2pdf from 'html2pdf.js'
  
  const props = defineProps({
    order: Object
  })
  
  const parsedProducts = computed(() => {
    const list = []
    const raw = props.order.products || ''
    const items = raw.split(',')
    for (const text of items) {
      const parts = text.trim().split(' x')
      const name = parts[0] || ''
      const quantity = parseInt(parts[1]) || 1
      list.push({ name, quantity })
    }
    return list
  })
  
  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString() + '₱'
  }
  
  const exportToPDF = () => {
    html2pdf()
      .from(document.querySelector('.invoice'))
      .set({ margin: 10, filename: `HOADON-${props.order.id}.pdf`, html2canvas: {}, jsPDF: { format: 'a4' } })
      .save()
  }
  
  const exportToExcel = () => {
    const wsData = [
      ['STT', 'Tên SP', 'SL'],
      ...parsedProducts.value.map((item, idx) => [idx + 1, item.name, item.quantity]),
      ['', 'Tổng tiền', props.order.total]
    ]
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice')
    XLSX.writeFile(wb, `HOADON-${props.order.id}.xlsx`)
  }
  </script>
  
  <style scoped>
  .invoice {
    font-family: Arial, sans-serif;
  }
  table {
    font-size: 14px;
  }
  </style>
  