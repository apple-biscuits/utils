<template>
  <div class="exam-results">
    <div class="container">
      <!-- Input Form -->
      <div class="input-form">
        <h2>成绩信息录入</h2>
        <div class="form-group">
          <label>姓名：</label>
          <input v-model="formData.name" type="text" placeholder="请输入姓名">
        </div>
        <div class="form-group">
          <label>报名号：</label>
          <input v-model="formData.registrationId" type="text" placeholder="请输入报名号">
        </div>
        <div class="form-group">
          <label>准考证号：</label>
          <input v-model="formData.examId" type="text" placeholder="请输入准考证号">
        </div>

        <div class="subjects-section">
          <h3>考试科目</h3>
          <div v-for="(subject, index) in formData.subjects" :key="index" class="subject-input">
            <div class="form-group">
              <label>{{ getSubjectLabel(index) }}</label>
              <input v-model="subject.name" type="text" placeholder="科目名称">
              <input v-model="subject.score" type="number" placeholder="分数">
              <button v-if="index > 0" @click="removeSubject(index)" class="remove-btn">删除</button>
            </div>
          </div>
          <button @click="addSubject" class="add-btn" v-if="formData.subjects.length < 4">添加科目</button>
        </div>

        <button @click="generateScoreCard" class="generate-btn">生成成绩单</button>
      </div>

      <!-- Score Card Display -->
      <div class="content-box" v-if="showScoreCard">
        <div class="info-grid">
          <div class="label">姓名：</div>
          <div>{{ formData.name }}</div>

          <div class="label">报名号：</div>
          <div>{{ formData.registrationId }}</div>

          <div class="label">准考证号：</div>
          <div>{{ formData.examId }}</div>

          <div class="label">总分：</div>
          <div>{{ totalScore }}</div>

          <template v-for="(subject, index) in formData.subjects" :key="index">
            <template v-if="subject.name && subject.score">
              <div class="label">{{ getSubjectLabel(index) }}</div>
              <div>({{ subject.name }}): {{ subject.score }}</div>
            </template>
          </template>

          <div class="label">备注：</div>
          <div>无</div>
        </div>

        <div class="button-container">
          <button class="back-button" @click="showScoreCard = false">
            返回
          </button>
          <button class="download-button" @click="downloadScoreCard">
            下载成绩单
          </button>
        </div>
        <!-- Note -->
      <div class="note">
        注：若查询的成绩为空值，表示有缺考、违纪等情况。若仍对查询的结果有疑问，请咨询相应的招生单位。
      </div>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import html2canvas from 'html2canvas';

const showScoreCard = ref(false);
const canvas = ref(null);

const formData = ref({
  name: '何凯文',
  registrationId: '123456789',
  examId: '123456789',
  subjects: [{ name: '英语一', score: '89' },{name:'数学一',score:'90'}]
});

const totalScore = computed(() => {
  return formData.value.subjects.reduce((sum, subject) => {
    return sum + (subject.score ? parseInt(subject.score) : 0);
  }, 0);
});

const getSubjectLabel = (index) => {
  const labels = ['第一门：', '第二门：', '第三门：', '第四门：'];
  return labels[index] || `第${index + 1}门：`;
};

const addSubject = () => {
  if (formData.value.subjects.length < 4) {
    formData.value.subjects.push({ name: '', score: '' });
  }
};

const removeSubject = (index) => {
  formData.value.subjects.splice(index, 1);
};

const generateScoreCard = () => {
  if (!formData.value.name || !formData.value.registrationId || !formData.value.examId) {
    alert('请填写完整的基本信息');
    return;
  }

  if (!formData.value.subjects.some(subject => subject.name && subject.score)) {
    alert('请至少填写一个科目的信息');
    return;
  }

  showScoreCard.value = true;
};

const downloadScoreCard = () => {
  const contentBox = document.querySelector('.content-box');
  if (!contentBox) return;

  html2canvas(contentBox).then(canvas => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${formData.value.name}_成绩单.png`;
    link.href = dataUrl;
    link.click();
  });
};
</script>

<style scoped>
.exam-results {
  min-height: 100vh;
  background-color: #ffffff;
}

.container {
  margin: 0 auto;
  padding: 24px;
  display: flex;
  gap: 32px;
}

.input-form {
  flex: 0 0 30%;
  min-width: 420px;
  padding: 24px;
  background-color: #fafafa;
}

.content-box {
  /* flex: 0 0 60%; */
  flex: 1;
  min-width: 320px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 24px;
  padding-left: 40px;
  height: fit-content;
}

.form-group input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  max-width: 280px;
}

.input-form h2 {
  color: #1f2937;
  margin-bottom: 24px;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
}

.form-group input {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  max-width: 320px;
  background-color: #fff;
  margin-bottom: 8px;
}

.subjects-section {
  margin-top: 32px;
}

.subject-input {
  margin-bottom: 20px;
}

.subjects-section h3 {
  color: #1f2937;
  margin-bottom: 16px;
  font-size: 1.25rem;
}

.subject-input .form-group {
  display: block;
}

.subject-input .form-group label {
  margin-bottom: 8px;
}

.subject-input .form-group input {
  margin-bottom: 8px;
}

.add-btn, .remove-btn, .generate-btn {
  background-color: #3b82f6;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-top: 8px;
}

.remove-btn {
  background-color: #ef4444;
  margin-left: 8px;
}

.generate-btn {
  margin-top: 24px;
  padding: 8px 24px;
}

.add-btn:hover, .generate-btn:hover {
  background-color: #2563eb;
}

.remove-btn:hover {
  background-color: #dc2626;
}

.content-box {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 40px;
  padding-left: 100px;
  padding-right: 100px;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  color: #374151;
}

.label {
  text-align: right;
  padding-right: 16px;
}

.admission-no {
  color: #2563eb;
}

.button-container {
  margin-top: 32px;
  margin-left: 80px;
  display: flex;
  gap: 16px;
}

.back-button,
.download-button {
  background-color: #3b82f6;
  color: white;
  padding: 6px 24px;
  border-radius: 4px;
  transition: background-color 0.3s;
  border: none;
}

.back-button:hover,
.download-button:hover {
  background-color: #2563eb;
}

.note {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 32px;
  padding-top: 16px;
}
</style>