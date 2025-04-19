// ... 已有导入 ...
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pdf-compress',
      name: 'pdfCompress',
      component: () => import('@/views/PdfCompressView.vue')
    },
    {
      path: '/image-compress',
      name: 'image-compress',
      component: () => import('@/views/ImageCompressView.vue')
    },
    {
      path: '/image-png-to-jpg',
      name: 'png-to-jpg',
      component: () => import('@/views/ImagePngToJpgView.vue')
    },
    {
      path: '/image-png-to-icon',
      name: 'pngToIcon',
      component: () => import('@/views/ImagePngToIconView.vue')
    },
    {
      path: '/image-watermark',
      name: 'image-watermark',
      component: () => import('@/views/ImageWatermarkView.vue')
    },
    {
      path: '/p-score-edit',
      name: 'p-score-edit',
      component: () => import('@/views/PScoreEditView.vue')
    },
    {
      path: '/audio-visualization',
      name: 'audio-visualization',
      component: () => import('@/views/AudioVisualizationView.vue')
    },
  ]
})
export default router