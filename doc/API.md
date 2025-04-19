# API 文档

## 接口规范
- 请求方式：POST
- 数据格式：JSON
- 授权方式：Bearer Token

## 示例接口
### 图片上传接口
```
POST /api/upload
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

Body:
  file: <二进制文件>

Response 200:
{
  "url": "/uploads/xxx.jpg",
  "size": 1024
}
```

## 通用响应格式
```json
{
  "code": 200,
  "data": {},
  "message": "success"
}
```

## 错误码说明
| 状态码 | 说明         |
|--------|--------------|
| 401    | 未授权访问    |
| 413    | 文件大小超限  |
| 415    | 文件格式错误  |