# Script pentru inițializarea Git și push pe GitHub
# Rulează după instalarea Git

# Verifică dacă Git este instalat
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git nu este instalat. Instalează Git mai întâi:" -ForegroundColor Red
    Write-Host "https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Inițializare repository Git..." -ForegroundColor Green

# Inițializează Git
git init

# Configurează Git (dacă nu e deja configurat)
$gitUser = git config --global user.name
$gitEmail = git config --global user.email

if (!$gitUser) {
    $userName = Read-Host "Introdu numele tău pentru Git"
    git config --global user.name "$userName"
}

if (!$gitEmail) {
    $userEmail = Read-Host "Introdu email-ul tău pentru Git"
    git config --global user.email "$userEmail"
}

# Adaugă remote origin
git remote add origin https://github.com/Cosmln23/Spa-Auto-Demo.git

# Adaugă toate fișierele
git add .

# Primul commit
git commit -m "🚀 Initial commit: Professional Spa Auto Demo with AI Voice Assistant

Features:
- ✅ Next.js 14 + TypeScript + Tailwind CSS
- ✅ Desktop & Mobile responsive dashboard
- ✅ Professional project structure
- ✅ CI/CD workflows (GitHub Actions)
- ✅ Code quality tools (ESLint, Prettier, Husky)
- ✅ Comprehensive documentation system
- 🔄 Ready for Supabase integration
- 🔄 Ready for OpenAI Realtime API integration"

# Push pe GitHub
Write-Host "📤 Push pe GitHub..." -ForegroundColor Green
git branch -M main
git push -u origin main

Write-Host "✅ Repository configurat cu succes!" -ForegroundColor Green
Write-Host "🌐 Accesează: https://github.com/Cosmln23/Spa-Auto-Demo" -ForegroundColor Cyan
