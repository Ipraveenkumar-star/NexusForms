# 🚀 Nexus Forms — Complete Setup Guide

A Google Forms-style community platform built from scratch.

---

## 📁 Project Structure

```
nexus-forms/
├── server/          ← Node.js + Express + MongoDB backend
│   ├── models/      ← Mongoose schemas (User, Form, Response)
│   ├── routes/      ← API endpoints (auth, forms, responses)
│   ├── middleware/  ← JWT auth guard
│   └── index.js    ← Server entry point
├── client/          ← React frontend
│   └── src/
│       ├── pages/   ← Dashboard, FormBuilder, FormFill, Responses, Auth
│       ├── components/ ← Sidebar, QuestionCard, Toast, etc.
│       └── context/ ← AuthContext (global login state)
└── README.md
```

---

## ✅ STEP 1 — Install Prerequisites

Make sure these are installed on your machine:

| Tool | Download Link | Version Needed |
|------|--------------|----------------|
| Node.js | https://nodejs.org | v18+ |
| npm | Comes with Node | v9+ |
| Git | https://git-scm.com | Any |

Check versions:
```bash
node -v
npm -v
git -v
```

---

## ✅ STEP 2 — Set Up MongoDB Atlas (Free Cloud Database)

1. Go to https://www.mongodb.com/atlas
2. Sign up for free
3. Click **"Create a Cluster"** → choose **Free tier (M0)**
4. Set a **username** and **password** (remember these!)
5. Under "Network Access" → Click **"Add IP Address"** → **"Allow Access From Anywhere"**
6. Click **"Connect"** → **"Connect your application"**
7. Copy the connection string — it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/nexusforms
   ```
   Replace `yourpassword` with your actual password.

---

## ✅ STEP 3 — Set Up the Backend (Server)

Open a terminal and run:

```bash
# 1. Go into server folder
cd nexus-forms/server

# 2. Install all dependencies
npm install

# 3. Create your environment file
cp .env.example .env
```

Now open `.env` in any text editor (Notepad, VS Code, etc.) and fill in:
```
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/nexusforms
JWT_SECRET=nexusforms_secret_key_2026
PORT=5000
```

Then start the server:
```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

Test it by opening: http://localhost:5000 in your browser.
You should see: `{"message":"Nexus Forms API is running!"}`

---

## ✅ STEP 4 — Set Up the Frontend (Client)

Open a **NEW terminal window** (keep the server running in the first one):

```bash
# 1. Go into client folder
cd nexus-forms/client

# 2. Install all dependencies
npm install

# 3. Start the React app
npm start
```

Your browser will open automatically at http://localhost:3000 🎉

---

## ✅ STEP 5 — GitHub Repository Setup (REQ-001)

```bash
# From the root nexus-forms/ folder:
git init
git add .
git commit -m "feat: initial Nexus Forms project setup"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/nexus-forms.git
git branch -M main
git push -u origin main
```

To invite team members:
1. Go to your GitHub repo → **Settings** → **Collaborators**
2. Click **"Add people"** → enter their GitHub username or email

---

## ✅ STEP 6 — How the App Works

### As an Admin:
1. Go to http://localhost:3000
2. Click **"Get Started"** → Register with name, email, password
3. You land on the **Dashboard** — see your forms overview
4. Click **"New Form"** → choose a template or blank
5. **Build your form**: Add title, description, questions (short text, paragraph, MCQ, checkbox, dropdown, rating)
6. Click **"Publish"** → get a shareable public link
7. Share the link with your community
8. Click **"Responses"** on any form to see all submissions

### As a Community Member:
1. Open the shared link (e.g., http://localhost:3000/f/abc123)
2. Fill out the form
3. Click **"Submit"**
4. Done! Admin sees the response immediately

---

## ✅ STEP 7 — Deploy Online (Free)

### Deploy Backend to Render:
1. Go to https://render.com → Sign up
2. Click **"New Web Service"** → Connect your GitHub repo
3. Set **Root Directory** to `server`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add Environment Variables: `MONGO_URI` and `JWT_SECRET`
7. Click **Deploy** → you get a URL like `https://nexus-forms-api.onrender.com`

### Deploy Frontend to Vercel:
1. Go to https://vercel.com → Sign up with GitHub
2. Click **"New Project"** → Import your repo
3. Set **Root Directory** to `client`
4. Add Environment Variable: `REACT_APP_API_URL=https://nexus-forms-api.onrender.com`
5. Click **Deploy** → your app is live! 🚀

---

## 📋 API Reference

| Method | Endpoint | Auth? | Description |
|--------|----------|-------|-------------|
| POST | /api/auth/register | No | Create admin account |
| POST | /api/auth/login | No | Login, get JWT token |
| GET | /api/forms | Yes | Get all your forms |
| POST | /api/forms | Yes | Create new form |
| GET | /api/forms/:id | No | Get form (public fill) |
| PUT | /api/forms/:id | Yes | Update form |
| DELETE | /api/forms/:id | Yes | Delete form |
| POST | /api/responses | No | Submit a response |
| GET | /api/responses/:formId | Yes | Get all responses |

---

## 🛠 Troubleshooting

**"Cannot connect to MongoDB"**
→ Check your MONGO_URI in .env — make sure IP is whitelisted in Atlas

**"Port 5000 already in use"**
→ Change PORT=5001 in .env and restart server

**"Module not found"**
→ Run `npm install` again in the folder showing the error

**CORS errors in browser**
→ Make sure the server is running on port 5000 and proxy is set in client/package.json

---

## 🗓 Implementation Timeline (from your spec)

| Step | Phase | Task | Date |
|------|-------|------|------|
| 1 | Admin | Repository Provisioning | 2026-06-12 |
| 2 | UI Setup | Dashboard Framing Layout | 2026-06-15 |
| 3 | UI Setup | Hamburger Menu Logic | 2026-06-17 |
| 4 | Form Core | Blank Canvas Interface | 2026-06-20 |
| 5 | Form Core | Dynamic Inputs Controller | 2026-06-24 |
| 6 | Backend | Database Schema Engineering | 2026-06-22 |
| 7 | Backend | Publish API Framework | 2026-06-27 |
| 8 | Deployment | Public Viewer Render | 2026-07-02 |
| 9 | Deployment | Submission Pipeline Routing | 2026-07-05 |
