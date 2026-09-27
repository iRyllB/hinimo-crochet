🧶 Hinimo Crochet

Welcome to the Hinimo Crochet project!

This guide will help you set up the project on your computer and run it locally.

📋 Prerequisites

Before installing the project, make sure you have:

Node.js installed

npm installed

Git installed (if you're cloning the project from GitHub)

A code editor such as Visual Studio Code

Check Node.js and npm

Open PowerShell, Command Prompt, or the VS Code terminal and run:

node --version
npm --version


If both commands return version numbers, you're ready to continue.

If you get an error saying that node, npm, or npx is not recognized, install Node.js first:

Node.js: https://nodejs.org/

After installing Node.js, close and reopen your terminal before continuing.

🚀 Installation
1. Clone the Repository

If you haven't downloaded the project yet, clone the repository using Git:

git clone <REPOSITORY-URL>


Then go into the project folder:

cd hinimo-crochet


Replace <REPOSITORY-URL> with the actual GitHub repository URL.

2. Install Dependencies

Once you're inside the project folder, run:

npm install


This will install all the packages and dependencies required by the project.

Wait for the installation to finish before proceeding.

3. Start the Development Server

Run:

npm run dev


You should see something similar to:

▲ Next.js
- Local: http://localhost:3000


Open your browser and go to:

http://localhost:3000

The Hinimo Crochet website should now be running.

🛑 Stopping the Development Server

To stop the development server, go back to your terminal and press:

Ctrl + C

🔄 Running the Project Again

Whenever you want to work on the project again:

1. Open the project folder
cd hinimo-crochet

2. Start the development server
npm run dev


Then open:

http://localhost:3000

🛠️ Common Problems
'npx' is not recognized

If you see:

npx : The term 'npx' is not recognized...


Node.js is probably not installed or has not been added to your system PATH.

Solution

Install Node.js from:

https://nodejs.org/

Restart your computer or close and reopen your terminal.

Check again:

node --version
npm --version
npx --version

'npm' is not recognized

This usually means Node.js is not installed correctly or its PATH configuration is missing.

Reinstall Node.js and make sure the installer is allowed to add Node.js to your PATH.

After installation, restart your terminal.

Port 3000 is already in use

If another application is already using port 3000, Next.js may give you another local address, such as:

http://localhost:3001


Use the URL shown in your terminal.

You can also stop another running Next.js server with:

Ctrl + C

Dependencies are not working

If you encounter dependency-related errors, try:

npm install


Then start the project again:

npm run dev


If that doesn't work, you can reinstall the dependencies:

Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install


Then:

npm run dev


Only do this if npm install does not resolve the problem.

📁 Project Structure

The project uses Next.js.

A typical project structure may look like:

hinimo-crochet/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
│
├── public/
│   └── ...
│
├── node_modules/
│
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md

Important folders

app/

Contains the main pages and components of the Next.js application.

public/

Contains static files such as images, icons, and other assets.

package.json

Contains the project's dependencies and available npm commands.

node_modules/

Contains installed packages.

Do not manually edit or upload the node_modules folder to GitHub.

👥 Working With Classmates

Before starting your work, always make sure you have the latest version of the project.

git pull


After making changes:

git add .
git commit -m "Describe your changes"
git push

Example
git add .
git commit -m "Added crochet products page"
git push


When working with Git, communicate with your teammates before making changes to the same files to avoid merge conflicts.

⚠️ Important Notes

Do not commit the node_modules folder.

Do not commit passwords, API keys, or other secrets.

Run npm install after pulling the project if dependencies have changed.

Make sure you're working on the correct Git branch before making major changes.

Always test the website locally before pushing your changes.

💻 Recommended Setup

We recommend using:

Node.js LTS

Visual Studio Code

Git

Google Chrome or another modern browser

🧶 Hinimo Crochet

Project: Hinimo Crochet
Framework: Next.js
Language: TypeScript
Package Manager: npm

Happy coding! 🧶✨