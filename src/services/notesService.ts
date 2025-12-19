import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, NoteData } from '../types';

const NOTES_KEY = 'notes';

export const notesService = {
  async getNotes(userId: string): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      return allNotes.filter(note => note.userId === userId);
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
      throw error;
    }
  },

  async addNote(userId: string, noteData: NoteData): Promise<Note> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      
      const newNote: Note = {
        id: Date.now().toString(),
        userId,
        title: noteData.title || '',
        content: noteData.content,
        category: noteData.category,
        dateAdded: new Date().toISOString(),
        dateUpdated: null,
      };

      allNotes.push(newNote);
      await this.saveNotes(allNotes);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  async updateNote(noteId: string, noteData: Partial<NoteData>): Promise<Note> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      
      const noteIndex = allNotes.findIndex(n => n.id === noteId);
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }

      allNotes[noteIndex] = {
        ...allNotes[noteIndex],
        ...noteData,
        dateUpdated: new Date().toISOString(),
      };

      await this.saveNotes(allNotes);
      return allNotes[noteIndex];
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      
      const filteredNotes = allNotes.filter(n => n.id !== noteId);
      await this.saveNotes(filteredNotes);
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  async getNotesByCategory(userId: string, category: 'work' | 'study' | 'personal'): Promise<Note[]> {
    try {
      const notes = await this.getNotes(userId);
      return notes.filter(note => note.category === category);
    } catch (error) {
      console.error('Error getting notes by category:', error);
      return [];
    }
  },
};

