const setupScript = `#!/bin/bash

# Firebase Project Setup Script
# ==============================

echo "🎯 AgriSentinel Firebase Setup"
echo "=============================="
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install -g firebase-tools

# Login
echo ""
echo "🔐 Please login to Firebase..."
firebase login

# Create project structure
echo ""
echo "📁 Creating project structure..."

mkdir -p functions/src
mkdir -p scripts
mkdir -p public

# Initialize Firebase project
echo ""
echo "🔥 Initializing Firebase project..."
firebase init

# Create necessary files
echo ""
echo "📝 Creating configuration files..."

# Create firestore.rules
cat > firestore.rules << 'EOF'
${firestoreRules}
EOF

# Create firestore.indexes.json
cat > firestore.indexes.json << 'EOF'
${JSON.stringify(firestoreIndexes, null, 2)}
EOF

# Create storage.rules
cat > storage.rules << 'EOF'
${storageRules}
EOF

# Create firebase.json
cat > firebase.json << 'EOF'
${JSON.stringify(firebaseConfig, null, 2)}
EOF

# Create package.json for Cloud Functions
cat > functions/package.json << 'EOF'
{
  "name": "agrisentinel-functions",
  "version": "1.0.0",
  "description": "Cloud Functions for AgriSentinel",
  "main": "lib/index.js",
  "scripts": {
    "lint": "eslint --ext .js,.ts .",
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0",
    "axios": "^1.6.0",
    "@google-cloud/bigquery": "^7.3.0"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "typescript": "^5.2.0"
  }
}
EOF

# Create sample data generator
cat > scripts/generate-sample-data.js << 'EOF'
${sampleDataGenerator}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
ui-debug.log

# Functions
functions/node_modules/
functions/lib/

# Service account keys
**/service-account-key.json

# Node
node_modules/
npm-debug.log

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
EOF

echo ""
echo "✅ Setup completed!"
echo ""
echo "📋 Next steps:"
echo "  1. Download service account key from Firebase Console"
echo "     → Project Settings → Service Accounts → Generate new private key"
echo "  2. Save as 'service-account-key.json' in project root"
echo "  3. Run: npm install (in functions directory)"
echo "  4. Run: ./scripts/deploy.sh"
echo ""
`;