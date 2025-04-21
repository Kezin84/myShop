import { createRouter, createWebHistory } from 'vue-router'

import ProductList from '../views/ProductList.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Orders from '../views/Orders.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import UpdateProfile from '../components/UpdateProfile.vue' 
import ManageUsers from '../components/ManageUsers.vue'

const routes = [
  {path:'/about',component:()=>import('@/views/AboutView.vue')},
  { path: '/', component: ProductList },
  { path: '/product/:id', component: ProductDetail },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout },
  { path: '/orders', component: Orders },
  { path: '/admin', component: Admin },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/category/:cat',
    component: () => import('@/views/CategoryFilter.vue')
  },
  {
    path: '/my-orders',
    component: () => import('@/components/MyOrders.vue')
  },
  {
    path: '/manage-orders',
    component: () => import('@/views/AdminOrderManager.vue')
  },
  {
    path: '/admin-stats',
    component: () => import('@/views/AdminStatsDebt.vue')
  },
  { path: '/profile', component: UpdateProfile },
  { path: '/admin-users', component: ManageUsers },

  
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
