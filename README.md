# Photography Portfolio Project

## Project Structure
- **Frontend:** React + Vite (`/frontend`)
- **Backend:** Node.js + Express (`/backend`)
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary

## 🚀 How to Run Manually

### Option 1: Development Mode (Best for coding)
You need **two** terminals open:

**Terminal 1 (Backend):**
```bash
npm start
# OR manually: node backend/server.js
```
*Server runs on: http://localhost:5000*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: http://localhost:5173*

---

### Option 2: Production Mode (Simulate Render)
This mimics exactly how the site runs on Render (Backend serves the Frontend).

1.  **Build Everything:**
    ```bash
    npm run build
    ```
    *(This installs dependencies and builds the React app into `frontend/dist`)*

2.  **Start the App:**
    ```bash
    npm start
    ```
    *Open http://localhost:5000 in your browser to see the full app.*

## 🛠 Deployment (Render)
This project is configured for **single-service** deployment.

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Environment Variables Required:**
    - `MONGO_URI`
    - `CLOUD_NAME`
    - `CLOUD_API_KEY`
    - `CLOUD_API_SECRET`
    - `NODE_ENV=production`
