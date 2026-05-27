// ── Firebase Configuration ────────────────────────────────────────────────────
//
// SETUP STEPS:
//   1. Go to https://console.firebase.google.com
//   2. Click "Add project" and follow the wizard
//   3. Inside the project, click the </> Web icon to add a Web App
//   4. In the left menu → Build → Authentication → Get started
//      → Enable "Email/Password" sign-in method
//   5. In the left menu → Build → Firestore Database → Create database
//      → Start in "test mode" (you can tighten rules later)
//   6. Go to Project Settings (gear icon) → Your apps → SDK setup
//      → Copy the config values below
//
// ─────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
    apiKey:            "YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
