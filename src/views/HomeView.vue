<template>
  <div class="home-container">
    <h1 class="title">在线工具集合</h1>
    <div class="tool-grid">
      <div 
        v-for="tool in tools" 
        :key="tool.id" 
        class="tool-card"
        @click="navigateTo(tool.path)"
      >
        <div class="tool-icon">{{ tool.icon }}</div>
        <h3 class="tool-title">{{ tool.title }}</h3>
        <p class="tool-desc">{{ tool.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tools = ref([
  { id: 1, 
    title: '图片压缩', 
    icon: '🖼️', 
    description: '支持JPG/PNG格式压缩', 
    path: '/image-compress' 
  },
  { id: 2,
    title: '图片加水印',
    icon: '💧',
    description: '支持文字水印添加',
    path: '/image-watermark' 
  },
  { id: 3,
    title: 'PDF压缩',
    icon: '📄',
    description: '高质量PDF文件压缩',
    path: '/pdf-compress' 
  },
  // 可继续添加更多工具项
   // 新增工具项 ▼
   { id: 4,
    title: 'PNG转JPG',
    icon: '📸',
    description: '高质量图片格式转换',
    path: '/image-png-to-jpg'
  },
  { id: 5,
    title: 'PNG转Icon',
    icon: '🎨',
    description: '生成多种尺寸网站图标',
    path: '/image-png-to-icon'
  },
  { id: 6,
    title: '音频可视化',
    icon: '📊',
    description: '实时音频频谱展示',
    path: '/audio-visualization'
  },
  { id: 7,
    title: '考研成绩P图',
    icon: '🎓',
    description: '研究生考试成绩单编辑工具',
    path: '/p-score-edit'
  },
  {
    id: 8,
    title: '微信聊天记录',
    icon: '💬',
    description: '自定义聊天记录生成',
    path: '/wechat-chat-fake'
  },
  {
    id: 9,
    title: '微信转账记录',
    icon: '💳',
    description: '模拟转账记录创建',
    path: '/wechat-transfer-fake'
  },
  {
    id: 10,
    title: '支付宝转账',
    icon: '💰',
    description: '电子支付凭证生成',
    path: '/alipay-transfer-fake'
  },
  {
    id: 11,
    title: 'QQ聊天记录',
    icon: '🐧',
    description: '即时通讯记录编辑器',
    path: '/qq-chat-fake'
  }
])

const navigateTo = (path) => {
  // 暂时保留导航功能，后续可添加具体页面
  router.push(path)
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(300px, 1fr));
  gap: 1.5rem;
  justify-content: center;
}



@media (max-width: 768px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}

.tool-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eaeaea;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.tool-title {
  color: #34495e;
  margin-bottom: 0.5rem;
}

.tool-desc {
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>