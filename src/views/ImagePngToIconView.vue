<template>
  <div class="container">
    <h1>PNG转Icon工具</h1>
    <div class="upload-area">
      <input type="file" accept=".png" @change="handleFileUpload" />
      <p>点击或拖拽PNG文件进行转换</p>
    </div>
    <div v-if="convertedIcons.length" class="download-section">
      <h3>生成图标尺寸：</h3>
      <div class="icon-sizes">
        <div 
          v-for="(icon, index) in convertedIcons"
          :key="index"
          class="icon-item"
          @click="downloadIcon(icon)"
        >
          {{ icon.size }}x{{ icon.size }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const convertedIcons = ref([])

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'image/png') {
    const img = new Image()
    img.onload = async () => {
      const icons = await Promise.all([16, 24, 32, 48, 64, 128, 256].map(async size => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, size, size)
        
        // 转换为ICO格式
        const imageJS = await import('image-js')
        const pngData = await imageJS.Image.load(await blob.arrayBuffer())
        const icoData = pngData.save({ format: 'ico' })
        return { size, blob: new Blob([icoData], { type: 'image/x-icon' }) }
      }))
      convertedIcons.value = icons.filter(Boolean)
    }
    img.src = URL.createObjectURL(file)
  }
}

const downloadIcon = (icon) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(icon.blob)
  link.download = `${file.name.replace(/\.png$/i, '')}-${icon.size}x${icon.size}.ico`
  link.click()
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
}

.upload-area {
  border: 2px dashed #ccc;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #42b883;
}

.icon-sizes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.icon-item {
  padding: 1rem;
  border: 1px solid #eee;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-item:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}
</style>