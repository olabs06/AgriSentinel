const sampleDataGenerator = `
const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample Nigerian locations
const locations = [
  { state: 'Lagos', lga: 'Ikeja', coordinates: { latitude: 6.5964, longitude: 3.3415 } },
  { state: 'Oyo', lga: 'Ibadan North', coordinates: { latitude: 7.3775, longitude: 3.9470 } },
  { state: 'Kano', lga: 'Kano Municipal', coordinates: { latitude: 12.0022, longitude: 8.5919 } },
  { state: 'Rivers', lga: 'Port Harcourt', coordinates: { latitude: 4.8156, longitude: 7.0498 } },
  { state: 'Kaduna', lga: 'Kaduna North', coordinates: { latitude: 10.5105, longitude: 7.4165 } },
  { state: 'Anambra', lga: 'Awka', coordinates: { latitude: 6.2107, longitude: 7.0719 } },
  { state: 'Benue', lga: 'Makurdi', coordinates: { latitude: 7.7330, longitude: 8.5328 } },
  { state: 'Ondo', lga: 'Akure', coordinates: { latitude: 7.2571, longitude: 5.2058 } }
];

// Sample farmers
const farmers = [
  { name: 'Adebayo Ogunleye', phone: '+2348012345678', language: 'yo' },
  { name: 'Chidinma Okafor', phone: '+2348023456789', language: 'ig' },
  { name: 'Musa Ibrahim', phone: '+2348034567890', language: 'ha' },
  { name: 'Blessing Eze', phone: '+2348045678901', language: 'en' },
  { name: 'Oluwaseun Adeyemi', phone: '+2348056789012', language: 'yo' },
  { name: 'Fatima Abubakar', phone: '+2348067890123', language: 'ha' },
  { name: 'Emeka Nwankwo', phone: '+2348078901234', language: 'ig' },
  { name: 'Grace Okon', phone: '+2348089012345', language: 'en' }
];

// Disease data
const diseases = {
  cassava: [
    'Cassava_Bacterial_Blight',
    'Cassava_Brown_Streak_Disease',
    'Cassava_Green_Mite',
    'Cassava_Mosaic_Disease',
    'Healthy'
  ],
  tomato: [
    'Tomato_Early_Blight',
    'Tomato_Late_Blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_Leaf_Spot',
    'Tomato_Yellow_Leaf_Curl_Virus',
    'Healthy'
  ],
  maize: [
    'Maize_Fall_Armyworm',
    'Maize_Streak_Virus',
    'Maize_Leaf_Blight',
    'Maize_Rust',
    'Healthy'
  ],
  rice: [
    'Rice_Blast',
    'Rice_Bacterial_Leaf_Blight',
    'Rice_Brown_Spot',
    'Rice_Sheath_Blight',
    'Healthy'
  ],
  beans: [
    'Bean_Rust',
    'Bean_Angular_Leaf_Spot',
    'Bean_Anthracnose',
    'Bean_Common_Bacterial_Blight',
    'Healthy'
  ]
};

// Treatment advice templates
const treatmentAdvice = {
  'Cassava_Mosaic_Disease': {
    en: 'Remove infected plants immediately. Use CMD-resistant varieties like TME 419. Control whitefly vectors with neem oil (2L per hectare). Maintain 1m plant spacing.',
    yo: 'Gba awọn ọgbin ti o ni arun kuro lẹsẹkẹsẹ. Lo awọn iru ti o lagbara bi TME 419. Ṣe akoso whitefly pẹlu epo neem.',
    ha: 'Ku cire shukunkan da suka kamu nan da nan. Yi amfani da irin TME 419. Ku kashe whitefly da man neem.',
    ig: 'Wepụ osisi ndị nwere ọrịa ozugbo. Jiri ụdị dị ike dị ka TME 419. Jiri mmanụ neem chịkwa whitefly.'
  },
  'Tomato_Late_Blight': {
    en: 'Apply copper-based fungicide immediately. Remove infected leaves. Improve air circulation. Avoid overhead watering.',
    yo: 'Lo fungicide copper lẹsẹkẹsẹ. Gba awọn ewe ti o ni arun kuro. Mu afẹfẹ gba.',
    ha: 'Ku fesa fungicide copper nan da nan. Ku cire ganyen da suka kamu.',
    ig: 'Tinye fungicide copper ozugbo. Wepụ akwụkwọ ndị nwere ọrịa.'
  },
  'Maize_Fall_Armyworm': {
    en: 'Apply Emamectin Benzoate early morning. Hand-pick larvae. Use neem oil for organic control. Scout fields daily.',
    yo: 'Fi Emamectin Benzoate ni owurọ kùtùkùtù. Mu awọn larvae pẹlu ọwọ.',
    ha: 'Ku fesa Emamectin da safe. Ku kamo tsutsotsin da hannu.',
    ig: 'Tinye Emamectin n'isi ụtụtụ. Jiri aka were larvae.'
  }
};

async function generateSampleData() {
  console.log('🚀 Generating sample data for AgriSentinel...');
  
  try {
    // Create users
    console.log('\\n👥 Creating sample users...');
    const userIds = [];
    
    for (let i = 0; i < farmers.length; i++) {
      const farmer = farmers[i];
      const location = locations[i % locations.length];
      
      const userId = \`user_\${i + 1}\`;
      userIds.push(userId);
      
      await db.collection('users').doc(userId).set({
        name: farmer.name,
        phone: farmer.phone,
        email: \`\${farmer.name.toLowerCase().replace(/\\s+/g, '.')}@agrisentinel.test\`,
        location: location,
        farms: [
          {
            id: \`farm_\${i + 1}_001\`,
            name: \`\${location.lga} Farm\`,
            size: Math.random() * 4 + 1, // 1-5 hectares
            crops: ['cassava', 'maize'][Math.floor(Math.random() * 2)],
            soilType: ['sandy-loam', 'clay-loam', 'loamy'][Math.floor(Math.random() * 3)],
            registeredDate: new Date(2024, 0, 15).toISOString()
          }
        ],
        preferredLanguage: farmer.language,
        smsEnabled: Math.random() > 0.3,
        fcmTokens: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        role: 'farmer'
      });
      
      console.log(\`  ✅ Created user: \${farmer.name}\`);
    }
    
    // Create detections
    console.log('\\n🔍 Creating sample detections...');
    const detectionCount = 50;
    
    for (let i = 0; i < detectionCount; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const user = (await db.collection('users').doc(userId).get()).data();
      const cropTypes = ['cassava', 'tomato', 'maize', 'rice', 'beans'];
      const cropType = cropTypes[Math.floor(Math.random() * cropTypes.length)];
      const disease = diseases[cropType][Math.floor(Math.random() * diseases[cropType].length)];
      const isHealthy = disease === 'Healthy';
      const confidence = isHealthy 
        ? Math.random() * 0.2 + 0.8 
        : Math.random() * 0.3 + 0.7;
      const severity = isHealthy ? 'low' : ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
      
      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      const detectionId = \`detection_\${String(i + 1).padStart(3, '0')}\`;
      
      const advice = treatmentAdvice[disease] 
        ? treatmentAdvice[disease][user.preferredLanguage] || treatmentAdvice[disease].en
        : 'Monitor plant regularly. Contact extension officer if symptoms worsen.';
      
      await db.collection('detections').doc(detectionId).set({
        userId: userId,
        farmId: user.farms[0].id,
        cropType: cropType,
        disease: disease.replace(/_/g, ' '),
        confidence: confidence,
        severity: severity,
        imageUrl: \`gs://agrisentinel.appspot.com/detections/\${userId}/\${detectionId}.jpg\`,
        location: {
          state: user.location.state,
          lga: user.location.lga,
          latitude: user.location.coordinates.latitude + (Math.random() - 0.5) * 0.1,
          longitude: user.location.coordinates.longitude + (Math.random() - 0.5) * 0.1
        },
        analysisSource: confidence > 0.8 ? 'TFLite + Gemma' : 'Gemma Vision',
        advice: advice,
        treatment: {
          steps: [
            'Immediate action required',
            'Apply recommended treatment',
            'Monitor for 7-14 days'
          ],
          estimatedCost: \`₦\${Math.floor(Math.random() * 20000 + 10000)} - ₦\${Math.floor(Math.random() * 30000 + 20000)}\`
        },
        weather: {
          temperature: Math.floor(Math.random() * 10 + 25),
          humidity: Math.floor(Math.random() * 30 + 60),
          condition: ['sunny', 'partly cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
          precipitation: Math.random() * 20
        },
        timestamp: admin.firestore.Timestamp.fromDate(timestamp),
        synced: true
      });
      
      console.log(\`  ✅ Created detection: \${detectionId} - \${disease} (\${cropType})\`);
    }
    
    // Create alerts
    console.log('\\n🔔 Creating sample alerts...');
    
    for (let i = 0; i < 20; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const user = (await db.collection('users').doc(userId).get()).data();
      const severities = ['low', 'medium', 'high'];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      const daysAgo = Math.floor(Math.random() * 14);
      const sentAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      
      const messages = {
        en: \`Disease detected in your farm. Check AgriSentinel for details.\`,
        yo: \`A ti rii arun ninu oko re. Ṣayẹwo AgriSentinel fun alaye.\`,
        ha: \`An gano cuta a gonarku. Ku duba AgriSentinel.\`,
        ig: \`Achọpụtala ọrịa n'ugbo gị. Lelee AgriSentinel.\`
      };
      
      await db.collection('alerts').add({
        userId: userId,
        detectionId: \`detection_\${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}\`,
        type: severity === 'high' ? 'disease_outbreak' : 'disease_detection',
        severity: severity,
        message: {
          en: messages.en,
          yo: messages.yo,
          ha: messages.ha,
          ig: messages.ig
        },
        sentVia: user.smsEnabled ? ['push', 'sms'] : ['push'],
        sentAt: admin.firestore.Timestamp.fromDate(sentAt),
        read: Math.random() > 0.5
      });
    }
    
    console.log('  ✅ Created 20 alerts');
    
    // Create weather cache
    console.log('\\n🌦️ Creating weather cache...');
    
    for (const location of locations) {
      const locationKey = \`\${location.coordinates.latitude}_\${location.coordinates.longitude}\`.replace(/\\./g, '_');
      
      await db.collection('weather_cache').doc(locationKey).set({
        location: \`\${location.lga}, \${location.state}\`,
        coordinates: location.coordinates,
        current: {
          temperature: Math.floor(Math.random() * 10 + 25),
          humidity: Math.floor(Math.random() * 30 + 60),
          condition: ['sunny', 'partly cloudy', 'cloudy'][Math.floor(Math.random() * 3)],
          precipitation: 0
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          maxTemp: Math.floor(Math.random() * 5 + 30),
          minTemp: Math.floor(Math.random() * 5 + 20),
          precipitation: Math.floor(Math.random() * 50),
          condition: ['sunny', 'partly cloudy', 'rain'][Math.floor(Math.random() * 3)]
        })),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 6 * 60 * 60 * 1000))
      });
      
      console.log(\`  ✅ Created weather cache for \${location.lga}, \${location.state}\`);
    }
    
    // Create NASC seed data
    console.log('\\n🌱 Creating NASC seed data...');
    
    const seedVarieties = {
      cassava: [
        {
          name: 'TME 419',
          type: 'cassava',
          traits: ['CMD resistant', 'High yield', 'Early maturing'],
          maturityDays: 270,
          yieldPerHectare: '25-30 tonnes',
          approvedBy: 'NASC',
          availableAt: ['IITA', 'ADPs', 'Certified dealers']
        },
        {
          name: 'UMUCASS 36',
          type: 'cassava',
          traits: ['CMD resistant', 'CBSD tolerant', 'Good cooking quality'],
          maturityDays: 300,
          yieldPerHectare: '20-25 tonnes',
          approvedBy: 'NASC',
          availableAt: ['IITA', 'NRCRI']
        },
        {
          name: 'TMS 98/0505',
          type: 'cassava',
          traits: ['High yield', 'Suitable for all zones'],
          maturityDays: 330,
          yieldPerHectare: '30-35 tonnes',
          approvedBy: 'NASC',
          availableAt: ['IITA']
        }
      ],
      maize: [
        {
          name: 'SAMMAZ 52',
          type: 'maize',
          traits: ['Drought tolerant', 'Striga resistant', 'Early maturing'],
          maturityDays: 90,
          yieldPerHectare: '4-5 tonnes',
          approvedBy: 'NASC',
          availableAt: ['IITA', 'Premier Seeds', 'NASENI']
        },
        {
          name: 'SAMMAZ 72',
          type: 'maize',
          traits: ['High yield', 'Disease resistant'],
          maturityDays: 100,
          yieldPerHectare: '5-6 tonnes',
          approvedBy: 'NASC',
          availableAt: ['IITA']
        }
      ],
      tomato: [
        {
          name: 'Roma VF',
          type: 'tomato',
          traits: ['Disease resistant', 'Good for processing'],
          maturityDays: 75,
          yieldPerHectare: '40-50 tonnes',
          approvedBy: 'NASC',
          availableAt: ['East-West Seeds', 'Dizengoff']
        }
      ],
      rice: [
        {
          name: 'FARO 44',
          type: 'rice',
          traits: ['High yield', 'Blast resistant'],
          maturityDays: 120,
          yieldPerHectare: '6-7 tonnes',
          approvedBy: 'NASC',
          availableAt: ['NCRI', 'ABU']
        }
      ],
      beans: [
        {
          name: 'IAR 48',
          type: 'beans',
          traits: ['Early maturing', 'Disease resistant'],
          maturityDays: 65,
          yieldPerHectare: '1.5-2 tonnes',
          approvedBy: 'NASC',
          availableAt: ['IAR', 'ADPs']
        }
      ]
    };
    
    for (const [crop, varieties] of Object.entries(seedVarieties)) {
      await db.collection('nasc_seeds').doc(crop).set({
        varieties: varieties,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(\`  ✅ Created NASC data for \${crop} (\${varieties.length} varieties)\`);
    }
    
    console.log('\\n✅ Sample data generation completed successfully!');
    console.log('\\n📊 Summary:');
    console.log(\`  - Users: \${farmers.length}\`);
    console.log(\`  - Detections: \${detectionCount}\`);
    console.log(\`  - Alerts: 20\`);
    console.log(\`  - Weather locations: \${locations.length}\`);
    console.log(\`  - Seed varieties: \${Object.values(seedVarieties).flat().length}\`);
    
  } catch (error) {
    console.error('❌ Error generating sample data:', error);
  }
  
  process.exit(0);
}

generateSampleData();
`;