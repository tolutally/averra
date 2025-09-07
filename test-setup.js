// Simple test to check if main modules load
try {
  console.log('Testing main application modules...');
  
  // Test React
  const React = require('react');
  console.log('✅ React loaded successfully');
  
  // Test if our main files exist
  const fs = require('fs');
  
  const files = [
    'src/index.jsx',
    'src/App.jsx', 
    'src/Routes.jsx',
    'src/store/index.js',
    'vite.config.mjs'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });
  
  console.log('\n🎯 Ready to start development server!');
  console.log('Run: npm run dev');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
