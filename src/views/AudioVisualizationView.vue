<template>
    <div class="container">
        <h1>音频可视化</h1>

        <!-- 音频上传区域 -->
        <div class="upload-area" @drop.prevent="handleDrop" @dragover.prevent>
            <input type="file" accept="audio/*" @change="handleFileUpload" ref="fileInput" class="file-input" />
            <div class="upload-content">
                <span class="upload-icon">🎵</span>
                <p>点击或拖拽音频文件</p>
            </div>
        </div>

        <!-- 音频播放控制区域 -->
        <div v-if="audioSrc" class="audio-controls">
            <div class="audio-info">
                <span class="file-name">{{ fileName }}</span>
                <span class="time-info">{{ currentTime }} / {{ duration }}</span>
            </div>

            <div class="controls">
                <button @click="togglePlay" class="play-btn">
                    {{ isPlaying ? '⏸️' : '▶️' }}
                </button>
                <input type="range" min="0" :max="audioDuration" v-model="currentTimeValue" @input="seekAudio"
                    class="time-slider" />
                <div class="volume-control">
                    <span>🔊</span>
                    <input type="range" min="0" max="1" step="0.1" v-model="volume" @input="updateVolume"
                        class="volume-slider" />
                </div>
            </div>
        </div>

        <!-- 频谱可视化区域 -->
        <canvas ref="canvas" class="visualization-canvas" v-show="audioSrc"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 音频相关状态
const audioSrc = ref('')
const fileName = ref('')
const isPlaying = ref(false)
const currentTime = ref('0:00')
const duration = ref('0:00')
const currentTimeValue = ref(0)
const audioDuration = ref(0)
const volume = ref(1)

// DOM引用
const fileInput = ref(null)
const canvas = ref(null)

// Web Audio API相关变量
let audioContext = null
let audioSource = null
let analyser = null
let audioElement = null
let animationId = null

// 初始化Web Audio API
const initAudioContext = () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 2048
}

// 处理文件上传
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        processAudioFile(file)
    }
}

// 处理拖放上传
const handleDrop = (event) => {
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('audio/')) {
        processAudioFile(file)
    }
}

// 处理音频文件
const processAudioFile = (file) => {
    fileName.value = file.name
    const reader = new FileReader()

    reader.onload = (e) => {
        if (audioElement) {
            audioElement.pause()
        }

        audioSrc.value = e.target.result
        setupAudio()
    }

    reader.readAsDataURL(file)
}

// 设置音频
const setupAudio = () => {
    if (!audioContext) {
        initAudioContext()
    }

    if (audioElement) {
        audioElement.remove()
    }

    audioElement = new Audio(audioSrc.value)
    audioElement.addEventListener('loadedmetadata', () => {
        audioDuration.value = audioElement.duration
        duration.value = formatTime(audioElement.duration)
    })

    audioElement.addEventListener('timeupdate', () => {
        currentTime.value = formatTime(audioElement.currentTime)
        currentTimeValue.value = audioElement.currentTime
    })

    audioElement.addEventListener('ended', () => {
        isPlaying.value = false
    })

    audioSource = audioContext.createMediaElementSource(audioElement)
    audioSource.connect(analyser)
    analyser.connect(audioContext.destination)

    // 设置音量
    audioElement.volume = volume.value
}

// 播放/暂停控制
const togglePlay = async () => {
    if (!audioElement) return

    if (audioContext.state === 'suspended') {
        await audioContext.resume()
    }

    if (isPlaying.value) {
        audioElement.pause()
        // 停止动画
        if (animationId) {
            cancelAnimationFrame(animationId)
            animationId = null
        }
    } else {
        audioElement.play()
        // 开始绘制频谱
        drawSpectrum()
    }

    isPlaying.value = !isPlaying.value
}

// 更新音量
const updateVolume = () => {
    if (audioElement) {
        audioElement.volume = volume.value
    }
}

// 音频进度控制
const seekAudio = () => {
    if (audioElement) {
        audioElement.currentTime = currentTimeValue.value
    }
}

// 格式化时间
const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 绘制频谱
const drawSpectrum = () => {
    if (!canvas.value || !analyser) return

    // 检查canvas宽度，如果为0则重新设置尺寸
    if (canvas.value.width === 0) {
        canvas.value.width = canvas.value.offsetWidth || canvas.value.clientWidth
        canvas.value.height = 200
    }

    // 停止之前的动画
    if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
    }

    const ctx = canvas.value.getContext('2d')
    const width = canvas.value.width
    const height = canvas.value.height
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
        if (!isPlaying.value) return

        animationId = requestAnimationFrame(draw)
        analyser.getByteFrequencyData(dataArray)

        // 清空画布
        ctx.fillStyle = 'rgb(20, 20, 20)'
        ctx.fillRect(0, 0, width, height)

        const barWidth = (width / bufferLength) * 2.5
        let barHeight
        let x = 0

        // 绘制频谱柱状图
        for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * height

            // 创建渐变色
            const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
            gradient.addColorStop(0, '#00ff00')
            gradient.addColorStop(0.5, '#ffff00')
            gradient.addColorStop(1, '#ff0000')

            ctx.fillStyle = gradient
            ctx.fillRect(x, height - barHeight, barWidth, barHeight)

            x += barWidth + 1
        }
    }

    draw()
}

// 组件挂载时初始化canvas尺寸
onMounted(() => {
    if (canvas.value) {
        // 确保canvas尺寸与父容器一致
        const canvasElement = canvas.value
        const parentElement = canvasElement.parentElement
        canvasElement.width = parentElement.clientWidth
        canvasElement.height = 200

        // 初始化时清空画布
        const ctx = canvasElement.getContext('2d')
        ctx.fillStyle = 'rgb(20, 20, 20)'
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height)
    }

    window.addEventListener('resize', handleResize)
})

// 处理窗口大小变化
const handleResize = () => {
    if (canvas.value) {
        const canvasElement = canvas.value
        const parentElement = canvasElement.parentElement
        canvasElement.width = parentElement.clientWidth
        canvasElement.height = 200

        // 如果正在播放，重新开始绘制频谱
        if (isPlaying.value) {
            drawSpectrum()
        } else {
            // 如果没有播放，只清空画布
            const ctx = canvasElement.getContext('2d')
            ctx.fillStyle = 'rgb(20, 20, 20)'
            ctx.fillRect(0, 0, canvasElement.width, canvasElement.height)
        }
    }
}

// 组件卸载时清理资源
onUnmounted(() => {
    if (audioContext) {
        audioContext.close()
    }
    if (animationId) {
        cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}

.upload-area {
    border: 2px dashed #3498db;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    position: relative;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
    cursor: pointer;
}

.upload-area:hover {
    border-color: #2980b9;
    background-color: rgba(52, 152, 219, 0.05);
}

.file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.upload-content {
    pointer-events: none;
}

.upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
}

.audio-controls {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
}

.audio-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.play-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.3s;
}

.play-btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.time-slider {
    flex: 1;
    height: 5px;
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.volume-slider {
    width: 100px;
    height: 5px;
}

.visualization-canvas {
    width: 100%;
    height: 200px;
    background-color: rgb(20, 20, 20);
    border-radius: 8px;
}

input[type="range"] {
    -webkit-appearance: none;
    background: #ddd;
    border-radius: 5px;
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
}

input[type="range"]:hover {
    opacity: 1;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #3498db;
    border-radius: 50%;
    cursor: pointer;
}
</style>