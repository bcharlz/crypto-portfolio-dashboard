🚀 Complete Setup Commands (Any New PC)
Prerequisites Check:
bash# Check if Node.js is installed (need version 16+)
node --version
npm --version

# If not installed, download from: https://nodejs.org
Step 1: Navigate to your project
bash# Navigate to wherever you unzipped the files
cd C:\path\to\crypto-portfolio-dashboard
# or on Mac/Linux:
# cd /path/to/crypto-portfolio-dashboard
Step 2: Install all dependencies
bashnpm install
This reads package.json and downloads all required packages (~2-5 minutes)
Step 3: Start the development server
bashnpm run dev
Step 4: Open your browser
The terminal will show something like:
  VITE v4.4.5  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
Open: http://localhost:5173 (or whatever port it shows)

📋 Complete Command Sequence:
bash# 1. Check Node.js installation
node --version

# 2. Navigate to project folder
cd C:\Temp\crypto-portfolio-dashboard

# 3. Install dependencies (only needed first time)
npm install

# 4. Start development server
npm run dev

# 5. Open browser to: http://localhost:5173
🔄 For Subsequent Runs:
After the first setup, you only need:
bashcd C:\Temp\crypto-portfolio-dashboard
npm run dev
🛠️ Additional Commands:
bash# Build for production (creates 'dist' folder)
npm run build

# Preview production build locally
npm run preview

# Stop the development server
Ctrl + C (in terminal)

# Check available commands
npm run
🚨 Troubleshooting:
If npm install fails:
bash# Clear npm cache and try again
npm cache clean --force
npm install
If port 5173 is busy:
bash# Vite will automatically try next available port
# Or specify a different port:
npm run dev -- --port 3000
If you get permission errors (Mac/Linux):
bash# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
✅ Success Indicators:

npm install completes without errors
npm run dev shows "ready in XXXXms"
Browser opens to a beautiful crypto dashboard
Live reload works (changes to code update instantly)

📦 What Each Command Does:

npm install: Downloads all packages listed in package.json
npm run dev: Starts Vite development server with hot reload
npm run build: Creates optimized production files in dist/
npm run preview: Tests the production build locally

That's it! 🎉 Your crypto dashboard should be running at http://localhost:5173 and accessible from that PC only.