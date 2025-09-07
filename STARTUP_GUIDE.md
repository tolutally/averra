# Vouchline Development Server - Troubleshooting Guide

## 🚀 Quick Start Commands

### Method 1: Standard NPM
```bash
cd /Users/tobitowoju/Downloads/vouchline
npm run dev
```

### Method 2: Direct Vite
```bash
cd /Users/tobitowoju/Downloads/vouchline
npx vite --port 5173 --host localhost
```

### Method 3: Force Clear Cache
```bash
cd /Users/tobitowoju/Downloads/vouchline
rm -rf node_modules/.vite dist build
npm run dev
```

## 🔍 Common Issues & Solutions

### Issue 1: Port Already in Use
If port 5173 is busy, try:
```bash
lsof -ti:5173 | xargs kill -9  # Kill process on port 5173
npm run dev
```

### Issue 2: Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue 3: JSX/Import Errors
All files with JSX have been renamed to `.jsx`:
- ✅ `src/utils/featureFlags.jsx`
- ✅ `src/hooks/useTelemetry.jsx`
- ✅ `TelemetryService` export fixed

### Issue 4: Alternative Port
If 5173 doesn't work, try:
```bash
npx vite --port 3000
# or
npx vite --port 8080
```

## 🎯 Expected Output

When working, you should see:
```
VITE v5.0.0  ready in XXXms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🌐 Access URLs

- **Local**: http://localhost:5173
- **Sprint 0 Demo**: http://localhost:5173/sprint0-demo
- **Coordinator Dashboard**: http://localhost:5173/coordinator-dashboard

## 📱 Application Features (All DORMANT - No Backend)

✅ **Sprint 0 Complete**
- Routing & Guards
- Redux State Management  
- Telemetry (console-only)
- Error/Loading States
- Feature Flags

✅ **Sprint 1 Complete**
- File Preview & Review
- Acceptance Criteria
- Timeline & Audit Trail
- Comments & @mentions
- Batch Actions

## 🔧 Manual Debug Steps

1. **Check Node/NPM versions**:
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

2. **Verify package.json**:
   - ✅ "dev": "vite" script exists
   - ✅ All dependencies installed

3. **Check Vite config**:
   - ✅ Simplified configuration
   - ✅ React plugin enabled
   - ✅ Port 5173 configured

4. **Verify file structure**:
   - ✅ src/index.jsx (entry point)
   - ✅ src/App.jsx (main app)
   - ✅ src/Routes.jsx (routing)
   - ✅ index.html (Vite entry)

## 🎉 Success Indicators

When the server starts successfully:
1. **Console shows Vite ready message**
2. **Browser opens to http://localhost:5173**
3. **Sprint 0 Demo page loads**
4. **No console errors in browser**
5. **All telemetry shows "[DORMANT]" prefix**

## 🆘 If Still Not Working

Try these in order:
1. **Restart terminal completely**
2. **Check for other processes on port 5173**
3. **Try different port with `--port 3000`**
4. **Check file permissions**: `ls -la package.json`
5. **Re-install dependencies**: `npm install`

The application is **100% frontend-ready** with all backend calls dormant!
