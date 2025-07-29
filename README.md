## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with WebAssembly support

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/anoma-ide.git
cd anoma-ide

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5000` to access the IDE.

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📖 Usage Guide

### 1. **Writing Juvix Code**
- Create new `.juvix` files using the sidebar
- Write your smart contracts with full syntax highlighting
- Use the built-in examples as starting points

### 2. **Compiling Contracts**
- Click the "Compile" button in the Compiler tab
- View detailed build logs and any errors
- Export compiled `.nockma` files for deployment

### 3. **Managing Keys**
- Generate Ed25519 key pairs in the Keys tab
- Export keys for backup or import existing ones
- Keys are stored securely in browser localStorage

### 4. **Building Intents**
- Use the Intent Builder for common operations
- Create custom intents with the JSON editor
- Sign intents with your generated keys

### 5. **Testing Contracts**
- Use the Simulation tab to test your contracts
- Run different scenarios based on your contract type
- View execution results and performance metrics

## 🏗️ Project Structure

```
anoma-ide/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── layout/     # Layout components (Header, Sidebar)
│   │   │   ├── panels/     # Main IDE panels (Compiler, Intent, etc.)
│   │   │   └── ui/         # Basic UI components (Button, Card, etc.)
│   │   ├── pages/         # Main application pages
│   │   ├── lib/           # Utilities and libraries
│   │   │   ├── crypto.ts          # Cryptographic operations
│   │   │   ├── juvix-compiler.ts  # Juvix compilation logic
│   │   │   └── intent-builder.ts  # Intent creation utilities
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express server
│   ├── index.ts          # Main server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite integration
├── shared/               # Shared TypeScript types and schemas
└── Configuration files   # Build, deployment, and tooling config
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```
