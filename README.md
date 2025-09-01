# EcoVibeFloors

A luxury flooring import platform for Bulgarian homeowners and design professionals, featuring premium Dutch flooring solutions. The platform provides bilingual (English/Bulgarian) access to high-end natural materials with extended guarantees and expert guidance.

## 🌟 Features

- **Bilingual Support**: Full English/Bulgarian internationalization
- **Luxury Design**: Material UI v7 with custom wood-inspired theme
- **Modern Stack**: Next.js 15 with React 19 and App Router
- **Firebase Backend**: Firestore, Storage, Authentication, and Cloud Functions
- **Premium Focus**: Curated selection of Dutch flooring solutions

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Tech Stack

- **Frontend**: Next.js 15.5.2, React 19.1.0, TypeScript
- **Styling**: Material UI v7.3.1 with custom luxury theme
- **Internationalization**: next-intl 4.3.5 (English/Bulgarian)
- **Backend**: Firebase 12.2.1 (Firestore, Storage, Auth, Functions)
- **Build Tool**: Turbopack for fast development

## 🔥 Firebase Configuration

This project uses Firebase as its backend platform with the following setup:

### Firebase Project
- **Project ID**: `ecovibe-floors`
- **Project Name**: EcoVibe Floors
- **Primary Region**: `europe-west4`
- **Firestore Location**: `europe-central2`

### Enabled Services

#### Firestore Database
- **Rules File**: `firestore.rules`
- **Indexes File**: `firestore.indexes.json`
- **Location**: Europe Central (europe-central2)

#### Cloud Functions
- **Language**: TypeScript
- **Directory**: `functions/`
- **Emulator Port**: 5001

#### App Hosting
- **Backend Name**: `ecovibe-floors-backend`
- **Region**: `europe-west4`
- **Root Directory**: `/`
- **Config**: `apphosting.yaml`

#### Cloud Storage
- **Rules File**: `storage.rules`
- **Emulator Port**: 5004

#### Firebase Emulators
- **App Hosting**: Port 5002
- **Functions**: Port 5001  
- **Firestore**: Port 5003
- **Storage**: Port 5004
- **Emulator UI**: Auto-assigned port

### Firebase Files Structure
```
├── firebase.json           # Firebase configuration
├── .firebaserc            # Project aliases
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── storage.rules          # Storage security rules
├── apphosting.yaml        # App Hosting configuration
├── apphosting.emulator.yaml # Local emulator overrides
└── functions/             # Cloud Functions
    ├── src/index.ts
    ├── package.json
    └── tsconfig.json
```

### Development with Emulators

Start Firebase emulators for local development:
```bash
firebase emulators:start
```

This will start:
- Firestore Emulator on port 5003
- Functions Emulator on port 5001
- Storage Emulator on port 5004
- App Hosting Emulator on port 5002
- Emulator UI (auto-assigned port)

### Deployment

Deploy to Firebase:
```bash
firebase deploy
```

Deploy specific services:
```bash
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only storage
firebase deploy --only apphosting
```

## 🌐 Internationalization

### Supported Locales
- **English** (`en`) - `/en/...`
- **Bulgarian** (`bg`) - `/bg/...`

### Translation Files
- `messages/en.json` - English translations
- `messages/bg.json` - Bulgarian translations

### Configuration
- **Routing**: `i18n/routing.ts`
- **Request handling**: `i18n/request.ts`  
- **Middleware**: `middleware.ts`

## 🎨 Design System

### Color Palette
- **Primary**: #8B4513 (Saddle Brown) - Premium wood representation
- **Secondary**: #2E7D32 (Forest Green) - Eco-friendly nature
- **Font**: Roboto with Latin and Cyrillic subsets

### Material UI v7 Grid Usage
```jsx
<Grid container spacing={2}>
  <Grid size={{ xs: 6, md: 8 }}>
    <p>Content</p>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <p>Content</p>
  </Grid>
</Grid>
```

## 📁 Project Structure

```
├── app/[locale]/          # Internationalized pages and layouts
├── lib/                   # Shared utilities (Firebase, Theme)
├── i18n/                  # Internationalization config
├── messages/              # Translation JSON files
├── functions/             # Firebase Cloud Functions
├── public/                # Static assets
├── .agent-os/             # Agent OS product documentation
└── middleware.ts          # Next.js middleware for i18n
```

## 🔐 Environment Variables

All Firebase configuration uses `NEXT_PUBLIC_` prefixes for client-side access:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 📝 Development Notes

- All `params` in layouts/pages must be awaited (Next.js 15 requirement)
- Use `useTranslations()` hook for all text content
- Follow Material UI luxury design system patterns
- Firebase client configuration uses public environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software for EcoVibe Floors.
