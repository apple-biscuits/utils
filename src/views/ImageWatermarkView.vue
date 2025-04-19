<template>
  <div class="image-process-container">
    <div class="upload-section">
      <input type="file" @change="handleFileUpload" accept="image/*" />
      <button @click="downloadImage">下载处理结果</button>
    </div>
    
    <div class="preview-area">
      <canvas ref="canvas" class="preview-canvas"></canvas>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>水印文字：</label>
        <input v-model="watermarkText" type="text" />
      </div>
      
      <div class="control-group">
        <label>字体样式：</label>
        <select v-model="selectedFont">
          <option>Arial</option>
          <option>Microsoft YaHei</option>
          <option>SimSun</option>
        </select>
      </div>

      <div class="control-group">
        <label>透明度：</label>
        <input 
          v-model="opacity" 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          @input="updateCanvas"
        />
        <span>{{ (opacity * 100).toFixed(0) }}%</span>
      </div>

      <div class="control-group">
        <label>文字颜色：</label>
        <input v-model="watermarkColor" type="color" @input="updateCanvas" />
      </div>
      
      <div class="position-controls">
        <button 
          v-for="pos in positions" 
          :key="pos"
          @click="selectedPosition = pos"
          :class="{ active: selectedPosition === pos }"
        >
          {{ posMap[pos] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const watermarkText = ref('Watermark')
const selectedFont = ref('Arial')
const opacity = ref(0.7)
const selectedPosition = ref('center')
const imageFile = ref<File | null>(null)
const watermarkColor = ref('#000000')

const positions = ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right']
const posMap = {
  'top-left': '左上',
  'top-right': '右上',
  'center': '居中',
  'bottom-left': '左下',
  'bottom-right': '右下'
}

watch([watermarkText, selectedFont, opacity, selectedPosition], () => {
  updateCanvas()
})

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  imageFile.value = file
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      if (!canvas.value) return
      
      canvas.value.width = img.width
      canvas.value.height = img.height
      ctx.value = canvas.value.getContext('2d')
      drawImageWithWatermark(img)
    }
    img.src = e.target?.result as string
  }
  
  reader.readAsDataURL(file)
}

const drawImageWithWatermark = (img: HTMLImageElement) => {
  if (!ctx.value || !canvas.value) return
  
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.value.drawImage(img, 0, 0)
  
  // 水印绘制逻辑
  ctx.value.globalAlpha = opacity.value
  ctx.value.font = `24px ${selectedFont.value}`
  const hex = watermarkColor.value.replace('#', '');
const r = parseInt(hex.substring(0,2), 16);
const g = parseInt(hex.substring(2,4), 16);
const b = parseInt(hex.substring(4,6), 16);
ctx.value.fillStyle = `rgba(${r},${g},${b},${opacity.value})`
  ctx.value.textAlign = 'center'
  ctx.value.textBaseline = 'middle'
  
  const positions = {
    'top-left': [50, 50],
    'top-right': [canvas.value.width - 50, 50],
    'center': [canvas.value.width / 2, canvas.value.height / 2],
    'bottom-left': [50, canvas.value.height - 50],
    'bottom-right': [canvas.value.width - 50, canvas.value.height - 50]
  }
  
  const [x, y] = positions[selectedPosition.value]
  ctx.value.fillText(watermarkText.value, x, y)
}

const updateCanvas = () => {
  if (!imageFile.value) return
  const img = new Image()
  img.src = URL.createObjectURL(imageFile.value)
  img.onload = () => drawImageWithWatermark(img)
}

const downloadImage = () => {
  if (!canvas.value) return
  
  const link = document.createElement('a')
  link.download = 'watermarked-image.png'
  link.href = canvas.value.toDataURL('image/png')
  link.click()
}
</script>

<style scoped>
.image-process-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.upload-section {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.preview-canvas {
  max-width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
}

.controls {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.control-group {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-group label {
  min-width: 80px;
}

.position-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.position-controls button {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.position-controls button.active {
  border-color: #646cff;
  background: #f0f2ff;
}
</style>

ctx.fillStyle = `${watermarkColor.value}${Math.round(opacity.value * 255).toString(16).padStart(2, '0')}`