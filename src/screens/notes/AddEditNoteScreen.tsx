import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { notesService } from '../../services/notesService';
import { colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../types';

type AddEditNoteScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'AddEditNote'>;
type AddEditNoteScreenRouteProp = RouteProp<MainStackParamList, 'AddEditNote'>;

interface AddEditNoteScreenProps {
  route: AddEditNoteScreenRouteProp;
  navigation: AddEditNoteScreenNavigationProp;
}

export default function AddEditNoteScreen({ route, navigation }: AddEditNoteScreenProps) {
  const { user } = useAuth();
  const { noteId, category } = route.params || {};
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  const loadNote = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const notes = await notesService.getNotes(user.id);
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setTitle(note.title || '');
        setContent(note.content || '');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load note');
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!content.trim()) {
      Alert.alert('Error', 'Note content is required');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setLoading(true);
    try {
      if (noteId) {
        // Update existing note
        await notesService.updateNote(noteId, {
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        // Create new note
        await notesService.addNote(user.id, {
          title: title.trim(),
          content: content.trim(),
          category: category || 'personal',
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title (Optional)</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter note title..."
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Note Content *</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Write your note here..."
              placeholderTextColor={colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.categoryInfo}>
            <Ionicons name="folder-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.categoryText}>
              Category: {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Personal'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cancelButton, loading && styles.buttonDisabled]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : noteId ? 'Update' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 200,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

