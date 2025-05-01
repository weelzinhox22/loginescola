/**
 * Simple deployment helper for Netlify
 * This script runs before the build process to ensure only the client-side app is deployed
 */
import { exec } from 'child_process';
import fs from 'fs';

console.log('🚀 Preparing for Netlify deployment...');

// Check if running in Netlify environment
const isNetlify = process.env.NETLIFY === 'true';

if (isNetlify) {
  console.log('✅ Running in Netlify environment');
  console.log('🔧 Building client-side only application...');
  
  // Netlify will run the build command from package.json (npm run build:client)
} else {
  console.log('⚙️ Running locally - testing Netlify build...');
  
  // Run the client build
  exec('npm run build:client', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`❌ Error output: ${stderr}`);
      return;
    }
    
    console.log(`✅ Build output: ${stdout}`);
    console.log('🎉 Build completed successfully! The site is ready for Netlify deployment.');
  });
} 