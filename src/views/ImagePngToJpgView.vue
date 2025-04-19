<template>
  <div class="container">
    <h1>PNG转JPG转换器</h1>
    <div class="upload-area">
      <input type="file" accept="image/png" @change="handleFileUpload" />
      <p>点击或拖拽PNG图片文件进行转换</p>
    </div>
    <div v-if="convertedFile" class="preview-section">
      <div class="background-select">
        <label>背景颜色：</label>
        <input type="color" v-model="backgroundColor" @change="updateConversion" />
      </div>
      <div class="preview-comparison">
        <div class="preview-box">
          <h3>原始PNG</h3>
          <img :src="originalPreview" />
          <p>{{ originalSize }}</p>
        </div>
        <div class="preview-box">
          <h3>转换后JPG</h3>
          <img :src="convertedPreview" />
          <p>{{ convertedSize }}</p>
        </div>
      </div>
      <button @click="downloadConverted">下载JPG文件</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const originalPreview = ref('')
const convertedPreview = ref('')
const originalSize = ref('')
const convertedSize = ref('')
const convertedFile = ref(null)
const originalFile = ref(null)
const backgroundColor = ref('#ffffff')

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (file && file.type === 'image/png') {
    originalFile.value = file
    originalPreview.value = URL.createObjectURL(file)
    originalSize.value = formatFileSize(file.size)
    updateConversion()
  }
}

const updateConversion = async () => {
  const img = new Image()
  img.src = originalPreview.value
  
  await new Promise(resolve => img.onload = resolve)

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')

  // 填充背景色
  ctx.fillStyle = backgroundColor.value
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0)

  // 转换为JPG格式
  canvas.toBlob(blob => {
    convertedPreview.value = URL.createObjectURL(blob)
    convertedFile.value = blob
    convertedSize.value = formatFileSize(blob.size)
  }, 'image/jpeg', 0.9)
}

const formatFileSize = (bytes) => {
  return (bytes / 1024).toFixed(2) + 'KB'
}

const downloadConverted = () => {
  const link = document.createElement('a')
  link.download = `converted_${Date.now()}.jpg`
  link.href = convertedPreview.value
  link.click()
}
</script>

<style scoped>
.background-select {
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.background-select input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 2px;
  border-radius: 4px;
  border: 2px solid #eaeaea;
}
</style>