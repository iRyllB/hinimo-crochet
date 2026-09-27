# HINIMO CROCHET

Welcome to our project! This application is built using a modern, high-performance web stack. Follow the instructions below to get your local development environment set up so we can start building together.

## 🚀 Tech Stack
- **Framework:** React 19 (using the new React Compiler)
- **Build Tool:** Vite (for lightning-fast server starts and hot-reloading)
- **Language:** TypeScript (for static typing and catching errors early)
- **Linter:** ESLint (to enforce code quality and best practices)

## 💻 Prerequisites
Before you begin, make sure you have the following installed on your computer:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (Highly recommended for TypeScript support)

## 🛠️ Setup Instructions

**1. Clone the repository**
Open your terminal and clone this project to your local machine:
```bash
git clone https://github.com/iRyllB/hinimo-crochet.git
```

**2. Navigate to the project directory**
```bash
cd <insert-project-folder-name>
```

**3. Install dependencies**
Download all the required packages (React, Vite, TypeScript, etc.):
```bash
npm install
```

**4. Start the development server**
Spin up the local environment:
```bash
npm run dev
```
The terminal will provide a local link (usually `http://localhost:5173`). `Ctrl + Click` (or `Cmd + Click`) the link to open the app in your browser!

## 📂 Project Structure
- `/src`: This is where we will do almost all of our work. 
  - `App.tsx`: The main React component and starting point of the app.
  - `main.tsx`: The entry point that mounts our React app to the HTML file.
- `/public`: Static assets (like the favicon) that don't need to be processed by Vite.
- `index.html`: The main HTML template.
- `vite.config.ts`: Configuration settings for Vite and the React Compiler.

## 🧰 Available Scripts
- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles the TypeScript and builds the app for production.
- `npm run lint`: Runs ESLint to check for code errors or formatting issues.

## ⚠️ Troubleshooting

**Windows PowerShell Error when running npm/npx commands?**
If you get a red error stating *"...cannot be loaded because running scripts is disabled on this system"* (SecurityError / PSSecurityException), it means Windows is blocking the Node scripts. 

**How to fix it:**
1. Open PowerShell as Administrator (or use your VS Code terminal).
2. Run this command to allow local scripts to run:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Type `Y` and press Enter when prompted.

Alternatively, you can just use **Command Prompt** or **Git Bash** instead of PowerShell.