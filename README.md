# 🍎 Karori

Um aplicativo desktop moderno para controle de calorias e acompanhamento nutricional, desenvolvido com Tauri, React e TypeScript.

## 📋 Pré-requisitos

Antes de executar o projeto, você precisa ter as seguintes ferramentas instaladas:

### 1. Node.js (versão 18 ou superior)

**Windows:**
- Baixe o instalador em: https://nodejs.org/
- Execute o arquivo `.msi` e siga as instruções

**macOS:**
```bash
# Usando Homebrew
brew install node

# Ou baixe diretamente de: https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
# Usando NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Ou usando snap
sudo snap install node --classic
```

### 2. Rust (versão 1.70 ou superior)

**Todas as plataformas:**
```bash
# Instalar Rust usando rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Reinicie o terminal ou execute:
source ~/.cargo/env

# Verifique a instalação
rustc --version
cargo --version
```

**Windows (alternativo):**
- Baixe o instalador em: https://rustup.rs/
- Execute o arquivo `.exe` e siga as instruções

### 3. Dependências do Sistema

**Windows:**
- Microsoft Visual Studio C++ Build Tools
- WebView2 (geralmente já instalado no Windows 10/11)

**macOS:**
```bash
# Instalar Xcode Command Line Tools
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install -y \
    libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```



## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd app-calorias/calorias
```

### 2. Instale as dependências do Node.js
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Instale as dependências do Rust (Tauri)
```bash
npm run tauri build --help
# Isso irá baixar e compilar as dependências do Tauri automaticamente
```

### 4. Execute o aplicativo em modo de desenvolvimento
```bash
npm run tauri dev
# ou
yarn tauri dev
# ou
pnpm tauri dev
```

### 5. Compile o aplicativo para produção
```bash
npm run tauri build
# ou
yarn tauri build
# ou
pnpm tauri build
```

## 📦 Scripts Disponíveis

- `npm run dev` - Executa apenas o frontend React
- `npm run build` - Compila o frontend para produção
- `npm run tauri dev` - Executa o aplicativo Tauri em modo desenvolvimento
- `npm run tauri build` - Compila o aplicativo Tauri para produção
- `npm run tauri icon` - Gera ícones do aplicativo

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Tauri (Rust)
- **Styling:** CSS3 com variáveis customizadas
- **Icons:** Lucide React
- **Build:** Vite + Tauri CLI


## 🔧 Solução de Problemas

### Erro de compilação no Windows
- Certifique-se de ter o Visual Studio Build Tools instalado
- Execute o PowerShell como administrador

### Erro de dependências no Linux
- Verifique se todas as dependências do sistema estão instaladas
- Execute `sudo apt update` antes de instalar as dependências

### Erro de permissão no macOS
- Execute `sudo xcode-select --install` se necessário
- Verifique se o Xcode Command Line Tools está atualizado

### WebView2 não encontrado (Windows)
- Baixe e instale o WebView2 Runtime: https://developer.microsoft.com/microsoft-edge/webview2/
