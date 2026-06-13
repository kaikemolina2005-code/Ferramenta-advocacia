# ⚡ TL;DR - GitHub + Vercel em 3 Passos

## 🚀 Passo 1: GitHub (2 minutos)

```
1. Ir para: https://github.com/new
2. Nome: advgd-crm
3. Create Repository
4. Copiar URL HTTPS
```

## 🚀 Passo 2: Git Push (2 minutos)

```powershell
cd "c:\Users\Usuario\Downloads\Ferramenta ADVGD"
git branch -M main
git remote add origin COLE_A_URL_AQUI
git push -u origin main
```

## 🚀 Passo 3: Vercel Deploy (3 minutos)

### Opção A: CLI (Mais rápido)
```powershell
npm install -g vercel
vercel login
cd frontend
vercel --prod
```

### Opção B: Dashboard
```
https://vercel.com
→ Add New → Project
→ Selecionar advgd-crm
→ Deploy
```

---

## ✅ Pronto!

**Resultado**: 
- App online em `https://seu-projeto.vercel.app`
- Deploy automático a cada push no GitHub
- HTTPS + CDN global
- Tudo funcionando 🚀

---

**Documentação Completa**: Ver outros arquivos `.md`
