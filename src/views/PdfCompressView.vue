<template>
  <div class="container">
    <h1>PDF压缩工具</h1>
    <div class="upload-area">
      <input type="file" accept=".pdf" @change="" />
      <p>点击或拖拽PDF文件进行压缩</p>
    </div>
    <div  class="controls">
      <div class="control-group">
        <label>压缩级别：</label>
        <input 
          type="range" 
          min="0" 
          max="9"
          step="1"
          @input=""
        />
        <span>{{  }}</span>
      </div>
      <button @click="">开始压缩</button>
      <button  @click="">下载压缩文件</button>
    </div>
  </div>
</template>



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