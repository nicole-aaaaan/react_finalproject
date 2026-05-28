# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## terminal快速啟動步驟

請打開你的 **Git Bash**（或任何終端機），依序輸入以下指令：

### 1. 進入專案資料夾
cd YOUR_PROJECT_NAME
(請將 YOUR_PROJECT_NAME 換成你實際的資料夾名稱，例如 cd finance-app)

2. 安裝套件（第一次拿到專案時執行即可）
pnpm install

3. 啟動開發伺服器
pnpm dev

4. 開啟網頁
啟動後，終端機會出現類似以下的畫面：

Plaintext
  VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
在 Git Bash 中按住 Ctrl 鍵並用滑鼠點擊 http://localhost:5173/ 網址，或者直接複製網址貼到瀏覽器，就能直接開啟網站囉！
