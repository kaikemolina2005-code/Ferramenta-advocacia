#!/bin/bash

# Script para configurar Husky pre-commit hooks
# Executar a partir do diretório raiz do projeto: bash setup-husky.sh

echo "🔧 Instalando Husky e lint-staged..."
npm install husky lint-staged --save-dev

echo "📝 Inicializando Husky..."
npx husky install

echo "🎯 Criando pre-commit hook..."
npx husky add .husky/pre-commit "npm run pre-commit"

echo "✅ Husky configurado com sucesso!"
echo ""
echo "Próximos passos:"
echo "1. Configure 'pre-commit' em frontend/package.json (scripts)"
echo "2. Configure 'lint-staged' em frontend/package.json (root)"
echo "3. Execute: git add . && git commit -m 'chore: setup pre-commit hooks'"
