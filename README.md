# 🧶 Hinimo Crochet

Welcome to the Hinimo Crochet project!

This README will guide you through installing, setting up, and running the project on your computer so we can all collaborate.

## 📋 Prerequisites

Before starting, make sure you have the following installed:

*   [Node.js](https://nodejs.org/) (which includes npm)
*   [Git](https://git-scm.com/)
*   [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Check Node.js and npm

Open PowerShell, Command Prompt, or the VS Code terminal and run:

```bash
node --version
npm --version
```

You should see version numbers. If you get an error such as `'npm' is not recognized` or `'npx' is not recognized`, you need to install Node.js from [nodejs.org](https://nodejs.org/). After installing, close and reopen your terminal, then check again.

---

## 🚀 Installation

### 1. Clone the Repository

Open PowerShell or the VS Code terminal, and clone the repository:

```bash
git clone [https://github.com/iRyllB/hinimo-crochet.git](https://github.com/iRyllB/hinimo-crochet.git)
```

Then, enter the project folder:

```bash
cd hinimo-crochet
```

### 2. Install Dependencies

Inside the `hinimo-crochet` folder, run:

```bash
npm install
```

This installs all the packages required by the project. Wait for the installation to finish before continuing.

### 3. Start the Development Server

Run:

```bash
npm run dev
```

You should see something similar to:

```text
▲ Next.js
- Local: http://localhost:3000
```

Open your browser and visit: **http://localhost:3000**. The Hinimo Crochet website should now be running!

---

## 🛑 Stopping the Server

To stop the development server, go back to your terminal and press `Ctrl + C`.

## 🔄 Running the Project Again

After you have already installed the dependencies the first time, you don't need to run `npm install` every time. Simply open your terminal and run:

```bash
cd hinimo-crochet
npm run dev
```

---

## 🐙 Git and GitHub Setup

If you are contributing to the project, configure your Git identity first.

**Set your name:**
```bash
git config --global user.name "Your Name"
```

**Set your GitHub email** (use the email address associated with your GitHub account):
```bash
git config --global user.email "your-email@example.com"
```

*Check your settings anytime with:*
```bash
git config --global user.name
git config --global user.email
```

### Check the GitHub Repository Connection

Inside the project folder, verify your connection:

```bash
git remote -v
```

You should see something similar to:

```text
origin  [https://github.com/iRyllB/hinimo-crochet.git](https://github.com/iRyllB/hinimo-crochet.git) (fetch)
origin  [https://github.com/iRyllB/hinimo-crochet.git](https://github.com/iRyllB/hinimo-crochet.git) (push)
```

If nothing appears, add the GitHub repository manually:

```bash
git remote add origin [https://github.com/iRyllB/hinimo-crochet.git](https://github.com/iRyllB/hinimo-crochet.git)
```

---

## 📤 Pushing Changes to GitHub

After making changes to the project, follow these steps to share them:

**1. Check your changes**
```bash
git status
```

**2. Add your changes**
```bash
git add .
```

**3. Create a commit**
```bash
git commit -m "Describe your changes briefly"
```
*(Example: `git commit -m "Added crochet products page"`)*

**4. Push to GitHub**
```bash
git push
```
*(If this is your first push to the repository, you might need to run: `git push -u origin main`)*

---

## 📥 Getting the Latest Changes

Before working on the project each day, it's a good idea to get the latest changes from your classmates to avoid conflicts:

```bash
git pull
```

If your classmates have added new packages or dependencies, make sure to update your local files by running:

```bash
npm install
```

---

## 📁 Project Structure

This project is built using Next.js. A typical structure looks like this:

```text
hinimo-crochet/
│
├── app/                  # Application pages, layouts, and Next.js code
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
│
├── public/               # Static assets (images, icons, logos)
│   └── ...
│
├── node_modules/         # Installed packages (DO NOT commit to GitHub)
│
├── package.json          # Project dependencies and npm scripts
├── package-lock.json     # Exact dependency versions installed
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## 🛠️ Common Problems

### `'npx' or 'npm' is not recognized`

If you see an error like:

```text
npx : The term 'npx' is not recognized...
npm : The term 'npm' is not recognized...
```

Node.js is likely not installed, or it was not properly added to your system's PATH variable. 

**Solution:**
1. Download and install Node.js from [nodejs.org](https://nodejs.org/).
2. Keep the default settings during installation (especially the option to add it to PATH).
3. **Close your terminal** completely.
4. Open a new PowerShell or VS Code terminal and check again:

```bash
node --version
npm --version
npx --version
```