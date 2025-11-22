# AgriSentinel
AgriSentinel is an AI-powered, offline-first mobile platform that detects early signs of crop pests and diseases using a farmer’s phone camera, even without internet.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (\`npm install -g firebase-tools\`)
- A Google Cloud/Firebase account
- Firebase project created at console.firebase.google.com

## Quick Setup

### 1. Initial Setup

\`\`\`bash
# Make scripts executable
chmod +x scripts/*.sh

# Run setup script
./scripts/setup-firebase.sh
\`\`\`

### 2. Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Enable the following services:
   - Authentication (Email/Password, Phone)
   - Cloud Firestore
   - Cloud Storage
   - Cloud Functions
   - Firebase Cloud Messaging (FCM)

### 3. Download Service Account Key

1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as \`service-account-key.json\` in project root
4. **Never commit this file to git!**

### 4. Deploy Firebase Configuration

\`\`\`bash
# Deploy all Firebase resources
./scripts/deploy.sh
\`\`\`

This will deploy:
- ✅ Firestore security rules
- ✅ Firestore indexes
- ✅ Storage security rules
- ✅ Cloud Functions (optional)

### 5. Generate Sample Data (Optional)

\`\`\`bash
# Generate test data for development
node scripts/generate-sample-data.js
\`\`\`

This creates:
- 8 sample farmer accounts
- 50 disease detection records
- 20 alerts
- Weather cache for 8 locations
- NASC seed variety data

