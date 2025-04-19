<template>
  <div class="container">
    <h1>图片压缩工具</h1>
    <div class="upload-area">
      <input type="file" accept="image/*" @change="handleFileUpload" />
      <p>点击或拖拽图片文件进行压缩</p>
    </div>
    <div v-if="compressedFile" class="preview-section">
      <div class="format-select">
  <label>输出格式：</label>
  <select v-model="outputFormat">
    <option value="auto">自动</option>
    <option value="jpeg">JPEG</option>
    <option value="png">PNG</option>
  </select>
</div>
<div class="quality-control">
  <label>压缩质量：</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          v-model="compressionQuality"
          @input="updateCompression"
        >
        <span>{{ (compressionQuality * 100).toFixed(0) }}%</span>
      </div>
      <div class="preview-comparison">
        <div class="preview-box">
          <h3>原始图片</h3>
          <img :src="originalPreview" />
          <p>{{ originalSize }}</p>
        </div>
        <div class="preview-box">
          <h3>压缩后图片</h3>
          <img :src="compressedPreview" />
          <p>{{ compressedSize }}</p>
        </div>
      </div>
      <button @click="downloadCompressed">下载压缩文件</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'


const originalPreview = ref('')
const compressedPreview = ref('')
const originalSize = ref('')
const compressedSize = ref('')
const compressionQuality = ref(0.8)
const compressedFile = ref(null)
const originalFile = ref(null)

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (file) {
    originalFile.value = file
    originalPreview.value = URL.createObjectURL(file)
    originalSize.value = formatFileSize(file.size)
    
    const img = new Image()
    img.src = originalPreview.value
    await new Promise(resolve => img.onload = resolve)
    updateCompression()
  }
}

const outputFormat = ref('auto')
const maxDimension = ref(1920)

const updateCompression = async () => {
  const img = new Image()
  img.src = originalPreview.value
  
  await new Promise(resolve => img.onload = resolve)
  
  // 限制最大尺寸
  let width = img.width
  let height = img.height
  if (width > maxDimension.value || height > maxDimension.value) {
    const ratio = Math.min(maxDimension.value / width, maxDimension.value / height)
    width = width * ratio
    height = height * ratio
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  // 保留PNG透明通道
  if (outputFormat.value === 'png' || (outputFormat.value === 'auto' && originalFile.value?.type === 'image/png')) {
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  ctx.drawImage(img, 0, 0, width, height)

  // 动态质量调整
  let optimizedQuality = compressionQuality.value
  let optimizedBlob = null
  
  // 获取原始文件大小
  const originalSize = originalFile.value.size
  
  // 自动优化循环
  for (let q = optimizedQuality; q >= 0.3; q -= 0.1) {
    const blob = await new Promise(resolve => 
      canvas.toBlob(blob => resolve(blob), 
      outputFormat.value === 'png' ? 'image/png' : 'image/jpeg', 
      q)
    )
    
    if (blob.size < originalSize || q <= 0.3) {
      optimizedQuality = q
      optimizedBlob = blob
      break
    }
  }

  compressionQuality.value = optimizedQuality
  compressedPreview.value = URL.createObjectURL(optimizedBlob)
  compressedFile.value = optimizedBlob
  compressedSize.value = formatFileSize(optimizedBlob.size)
}

const dataURLtoBlob = (dataUrl) => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while(n--){
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {type: mime})
}

const formatFileSize = (bytes) => {
  return (bytes / 1024).toFixed(2) + 'KB'
}

const downloadCompressed = () => {
  const link = document.createElement('a')
  link.download = `compressed_${Date.now()}.jpg`
  link.href = compressedPreview.value
  link.click()
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.upload-area {
  border: 2px dashed #eaeaea;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
  cursor: pointer;
}

.quality-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.preview-comparison {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.preview-box img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 1rem;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #2980b9;
}
</style>