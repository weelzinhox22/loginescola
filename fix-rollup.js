// Script para corrigir o problema com as dependências nativas do Rollup

import fs from 'fs';
import path from 'path';

console.log('Iniciando correção para o problema do Rollup...');

const rollupNativePath = path.resolve(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js');

if (fs.existsSync(rollupNativePath)) {
  console.log(`Encontrado arquivo problemático: ${rollupNativePath}`);
  
  // Fazer backup do arquivo original
  const backupPath = `${rollupNativePath}.backup`;
  fs.copyFileSync(rollupNativePath, backupPath);
  console.log(`Backup criado em: ${backupPath}`);
  
  // Substituir o conteúdo com uma versão que não tenta carregar dependências nativas
  const fixedContent = `
// Modified for Netlify deployment to avoid native dependencies issues
// Original file backed up as native.js.backup

exports.getDefaultDllDir = () => null;
exports.hasMagic = () => false;
exports.loadDll = () => null;
exports.needsDll = () => false;
exports.relocateDll = () => null;
`;

  fs.writeFileSync(rollupNativePath, fixedContent, 'utf8');
  console.log('Arquivo modificado com sucesso para evitar dependências nativas.');
} else {
  console.log(`Arquivo não encontrado: ${rollupNativePath}`);
  console.log('Você pode precisar instalar as dependências primeiro com npm install.');
}

console.log('Script de correção concluído.'); 