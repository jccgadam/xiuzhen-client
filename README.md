# 修真之路 · 客户端

React + Vite 前端项目。开发时通过 Vite proxy 转发 `/api` 到后端。

## 开发

```bash
npm install
npm run dev
```

默认端口 5173，API 请求通过 proxy 转发到 `http://127.0.0.1:3000`。

## 构建

```bash
npm run build
```

输出到 `dist/`。部署时设置 `VITE_API_URL` 为后端地址（如 `https://api.example.com`），否则使用相对路径（同源部署时可用）。
# xiuzhen-client
