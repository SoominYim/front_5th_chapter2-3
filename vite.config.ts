import { defineConfig, Plugin } from "vite"
import react from "@vitejs/plugin-react"


// 배포 환경 시 api 요청 주소 변경
function apiReplace(): Plugin { 
  return {
    name: "api-replace",
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.js')) { // JS/TS 파일만 처리
        return code.replace(/(["'`])\/api/g, `$1https://dummyjson.com`);
      }
    },
  }
}


// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === "build" ? "/front_5th_chapter2-3/" : "/";
  return {
    base,
    plugins: [react(), apiReplace()],
    server: {
    proxy: {
      "/api": {
        // target: 'https://jsonplaceholder.typicode.com',
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    },
  }
})
