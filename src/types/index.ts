export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'work' | 'study' | 'personal';
  dateAdded: string;
  dateUpdated: string | null;
}

export interface NoteData {
  title?: string;
  content: string;
  category: 'work' | 'study' | 'personal';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (email: string, password: string | undefined, username: string) => Promise<{ success: boolean; error?: string }>;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  NotesTabs: undefined;
  AddEditNote: { noteId?: string; category: 'work' | 'study' | 'personal' };
};

export type NotesTabParamList = {
  Work: undefined;
  Study: undefined;
  Personal: undefined;
  Profile: undefined;
};

