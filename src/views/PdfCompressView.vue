<template>
  <div class="container">
    <h1>PDF压缩工具</h1>
    <div class="upload-area">
      <input type="file" accept=".pdf" @change="handleFileUpload" />
      <p>点击或拖拽PDF文件进行压缩</p>
    </div>
    <div v-if="pdfFile" class="controls">
      <div class="control-group">
        <label>压缩级别：</label>
        <input 
          type="range" 
          v-model="compressionLevel"
          min="0" 
          max="9"
          step="1"
          @input="updateCompression"
        />
        <span>{{ compressionLevel }}</span>
      </div>
      <button @click="compressPdf">开始压缩</button>
      <button v-if="compressedBlob" @click="downloadCompressed">下载压缩文件</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import initWasmPdf, { PdfDocument } from 'wasm-pdf'

const pdfFile = ref<File | null>(null)
const compressionLevel = ref(3)
const compressedBlob = ref<Blob | null>(null)
let wasmInitialized = false

const initializeWasm = async () => {
  if (!wasmInitialized) {
    await initWasmPdf()
    wasmInitialized = true
  }
}

const handleFileUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  await initializeWasm()
  pdfFile.value = file
}

const compressPdf = async () => {
  if (!pdfFile.value) return
  
  const arrayBuffer = await pdfFile.value.arrayBuffer()
  const pdfDoc = PdfDocument.load(new Uint8Array(arrayBuffer))
  
  // 设置压缩参数
  pdfDoc.set_compression(compressionLevel.value)
  
  const compressedData = pdfDoc.save()
  compressedBlob.value = new Blob([compressedData], { type: 'application/pdf' })
  
  // 释放WASM内存
  pdfDoc.free()
}

const downloadCompressed = () => {
  if (!compressedBlob.value) return
  
  const url = URL.createObjectURL(compressedBlob.value)
  const link = document.createElement('a')
  link.href = url
  link.download = `compressed_${pdfFile.value?.name || 'document'}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.upload-area {
  margin: 2rem 0;
  padding: 2rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
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

button {
  padding: 0.8rem 1.5rem;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
}

button:hover {
  background: #535bf2;
}
</style>