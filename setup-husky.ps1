# Script para configurar Husky pre-commit hooks no Windows
# Executar a partir do diretório raiz do projeto: .\setup-husky.ps1

Write-Host "🔧 Instalando Husky e lint-staged..." -ForegroundColor Green
npm install husky lint-staged --save-dev

Write-Host "📝 Inicializando Husky..." -ForegroundColor Green
npx husky install

Write-Host "🎯 Criando pre-commit hook..." -ForegroundColor Green
npx husky add .husky/pre-commit "npm run pre-commit"

Write-Host "✅ Husky configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure 'pre-commit' em frontend/package.json (scripts)" -ForegroundColor Cyan
Write-Host "2. Configure 'lint-staged' em frontend/package.json (root)" -ForegroundColor Cyan
Write-Host "3. Execute: git add . && git commit -m 'chore: setup pre-commit hooks'" -ForegroundColor Cyan
