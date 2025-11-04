# Todo App

A modern, feature-rich todo application built with React Native, Expo, and Convex for real-time data synchronization.

## Features

- ✅ Create, edit, and delete todos
- 🔄 Real-time sync across devices with Convex
- 🎨 Beautiful gradient UI with light/dark theme support
- 📱 Native iOS and Android support
- ⚡ Fast and responsive

## Download App

**Android APK:** [Download Here](https://expo.dev/accounts/olu_olu/projects/todo-app/builds/3441aa1c-8279-4fd8-9836-2b4d9f04bb55)

### Installation Instructions (Android)

1. Click the download link above on your Android device
2. Download the APK file
3. Open the downloaded file
4. If prompted, enable "Install from Unknown Sources" in your device settings
5. Follow the installation prompts
6. Launch the app and start organizing your tasks!

> **Note:** iOS users will need to build from source or wait for App Store release.

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS, Mac only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npm install convex
   npx convex dev
   ```
   - Follow the prompts to create a Convex account
   - Your Convex deployment URL will be automatically configured

4. **Create environment file**
   
   Create a `.env.local` file in the root directory:
   ```
   EXPO_PUBLIC_CONVEX_URL=your_convex_deployment_url
   ```

### Running the App

#### Development Mode

```bash
# Start Expo development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS (Mac only)
npx expo start --ios

# Run in web browser
npx expo start --web
```

#### Using Expo Go (Quick Testing)

1. Install Expo Go from Play Store (Android) or App Store (iOS)
2. Run `npx expo start`
3. Scan the QR code with Expo Go app

## Building for Production

### Using EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure build**
   ```bash
   eas build:configure
   ```

4. **Build for Android**
   ```bash
   # Development build
   eas build -p android --profile development
   
   # Preview build (APK)
   eas build -p android --profile preview
   
   # Production build (AAB for Play Store)
   eas build -p android --profile production
   ```

5. **Build for iOS**
   ```bash
   eas build -p ios --profile production
   ```

### Local Build (Android)

```bash
# Generate native Android project
npx expo prebuild

# Build APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

## Project Structure

```
todo-app/
├── app/                    # App screens and navigation
├── assets/                 # Images, fonts, icons
├── components/            # Reusable components
│   └── TodoItem.tsx       # Individual todo item component
├── constants/             # Theme colors and constants
├── convex/                # Convex backend functions
│   ├── _generated/        # Auto-generated Convex code
│   └── todos.ts           # Todo database functions
├── hooks/                 # Custom React hooks
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## Convex Backend

This app uses Convex for real-time data synchronization. The backend functions are located in the `convex/` directory.

### Key Functions

- `getTodos()` - Fetch all todos
- `addTodo(text)` - Create a new todo
- `toggleTodo(id)` - Toggle todo completion status
- `updateTodo(id, text)` - Update todo text
- `deleteTodo(id)` - Delete a todo

## Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
npm install
npx expo start -c  # Clear cache
```

**Expo doctor errors**
```bash
npx expo-doctor
# Follow the suggestions to fix issues
```

**Convex connection issues**
- Ensure your `.env.local` file has the correct `EXPO_PUBLIC_CONVEX_URL`
- Run `npx convex dev` to start the Convex development server

**Build failures**
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
eas build -p android --clear-cache
```

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Convex** - Real-time backend
- **Expo Linear Gradient** - UI gradients
- **Ionicons** - Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

