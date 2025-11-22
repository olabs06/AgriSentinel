const deploymentScript = `#!/bin/bash

# AgriSentinel Firebase Deployment Script
# ========================================

echo "🚀 AgriSentinel Firebase Deployment"
echo "===================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase
echo "🔐 Logging in to Firebase..."
firebase login

# Select project
echo ""
echo "📁 Available projects:"
firebase projects:list

echo ""
read -p "Enter your Firebase project ID: " PROJECT_ID

firebase use $PROJECT_ID

# Deploy Firestore rules
echo ""
echo "📜 Deploying Firestore security rules..."
firebase deploy --only firestore:rules

# Deploy Firestore indexes
echo ""
echo "🔍 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

# Deploy Storage rules
echo ""
echo "📦 Deploying Storage security rules..."
firebase deploy --only storage

# Deploy Cloud Functions
echo ""
read -p "Deploy Cloud Functions? (y/n): " DEPLOY_FUNCTIONS

if [ "$DEPLOY_FUNCTIONS" = "y" ]; then
    echo "☁️  Deploying Cloud Functions..."
    cd functions
    npm install
    cd ..
    firebase deploy --only functions


# Generate sample data
echo ""
read -p "Generate sample data for testing? (y/n): " GENERATE_DATA

if [ "$GENERATE_DATA" = "y" ]; then
    echo "📊 Generating sample data..."
    node scripts/generate-sample-data.js
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Update Firebase config in your Flutter app"
echo "  2. Test authentication flow"
echo "  3. Verify security rules in Firebase Console"
echo "  4. Monitor Cloud Functions logs"
echo ""
`;
