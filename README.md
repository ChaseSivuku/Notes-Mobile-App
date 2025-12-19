# React Native Notes Application

A secure note-taking application built with React Native, featuring category-based organization, authentication, and full CRUD functionality.

## Features

### User Management
- **Authentication**: Register and login with email, password, and username
- **Protected Routing**: Automatic navigation based on authentication status
- **Profile Management**: Update login credentials (email, password, username)

### Notes Management
- **Categories**: Organize notes into Work, Study, and Personal categories
- **CRUD Operations**: 
  - Create new notes with title (optional) and content
  - Read all notes in each category
  - Update existing notes (with edit timestamp)
  - Delete notes with confirmation
- **Search**: Search notes by matching words in title and content
- **Sorting**: Sort notes by date added (ascending/descending)

### Design
- Modern, cohesive UI with consistent color scheme
- Intuitive navigation with bottom tabs
- Responsive layouts and smooth interactions

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation (Stack & Bottom Tabs)
- AsyncStorage for data persistence
- React Context for state management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
npm run android  # For Android
npm run ios       # For iOS
npm run web       # For Web
```

## Project Structure

```
Notes-Mobile-App/
├── App.tsx                 # Main app component with navigation
├── tsconfig.json           # TypeScript configuration
├── src/
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── navigation/
│   │   ├── AuthNavigator.tsx # Auth screens navigation
│   │   └── MainNavigator.tsx # Main app navigation
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── notes/
│   │   │   ├── WorkNotesScreen.tsx
│   │   │   ├── StudyNotesScreen.tsx
│   │   │   ├── PersonalNotesScreen.tsx
│   │   │   └── AddEditNoteScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── services/
│   │   ├── authService.ts     # Authentication service
│   │   └── notesService.ts     # Notes CRUD service
│   ├── components/
│   │   └── NoteCard.tsx        # Reusable note card component
│   └── constants/
│       └── colors.ts           # Color constants
└── package.json
```

## Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Navigate Categories**: Use bottom tabs to switch between Work, Study, and Personal notes
3. **Add Notes**: Tap the + button to create a new note in the current category
4. **Search**: Use the search bar to find notes by keywords
5. **Sort**: Toggle the sort button to change date order (ascending/descending)
6. **Edit/Delete**: Tap edit or delete icons on note cards
7. **Profile**: Update your credentials from the Profile tab

## Data Storage

All data is stored locally using AsyncStorage:
- User accounts and authentication
- Notes with categories, timestamps, and content

## Notes

- Passwords are stored in plain text for this demo. In production, implement proper password hashing.
- Data persists across app restarts via AsyncStorage.
- Each user's notes are isolated by user ID.

