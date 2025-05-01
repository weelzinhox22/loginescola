// Verification script for Netlify deployment
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying project structure for Netlify deployment...');

// Check for required files
const requiredFiles = [
  'netlify.toml',
  'netlify-prebuild.sh',
  'netlify-package.json',
  'netlify-tsconfig.json',
  'netlify-vite.config.ts',
  'netlify-schema.ts'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(path.resolve(process.cwd(), file))) {
    console.error(`❌ Missing required file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found required file: ${file}`);
  }
}

// Check if shared directory exists
if (!fs.existsSync(path.resolve(process.cwd(), 'shared'))) {
  console.log('⚠️ Warning: shared directory does not exist, will be created during prebuild');
} else {
  console.log('✅ Found shared directory');
}

// Check for client directory
if (!fs.existsSync(path.resolve(process.cwd(), 'client'))) {
  console.error('❌ Missing client directory');
  allFilesExist = false;
} else {
  console.log('✅ Found client directory');
}

// Check for index.html in client directory
if (!fs.existsSync(path.resolve(process.cwd(), 'client', 'index.html'))) {
  console.error('❌ Missing client/index.html file');
  allFilesExist = false;
} else {
  console.log('✅ Found client/index.html file');
}

if (allFilesExist) {
  console.log('✅ All required files exist. Project structure looks good for Netlify deployment.');
} else {
  console.error('❌ Some required files are missing. Please fix the issues before deploying to Netlify.');
  process.exit(1);
} 