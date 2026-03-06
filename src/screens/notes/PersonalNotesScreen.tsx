import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { notesService } from '../../services/notesService';
import NoteCard from '../../components/NoteCard';
import { colors } from '../../constants/colors';
import { horizontalPadding, listBottomPadding, fabSize, fabOffset } from '../../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList, Note } from '../../types';

type PersonalNotesScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface PersonalNotesScreenProps {
  navigation: PersonalNotesScreenNavigationProp;
}

export default function PersonalNotesScreen({ navigation }: PersonalNotesScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [user])
  );

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchQuery, sortOrder]);

  const loadNotes = async (): Promise<void> => {
    if (user) {
      const personalNotes = await notesService.getNotesByCategory(user.id, 'personal');
      setNotes(personalNotes);
    }
  };

  const filterAndSortNotes = (): void => {
    let filtered = [...notes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((note) => {
        const searchableText = `${note.title || ''} ${note.content}`.toLowerCase();
        const words = query.split(' ');
        return words.every((word) => searchableText.includes(word));
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dateAdded);
      const dateB = new Date(b.dateAdded);
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

    setFilteredNotes(filtered);
  };

  const handleDelete = (note: Note): void => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await notesService.deleteNote(note.id);
            loadNotes();
          },
        },
      ]
    );
  };

  const toggleSort = (): void => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const listPaddingBottom = listBottomPadding + insets.bottom;
  const fabBottom = fabOffset + insets.bottom;
  const fabRight = fabOffset + insets.right;

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
          <Ionicons
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sortText}>Date</Text>
        </TouchableOpacity>
      </View>

      {filteredNotes.length === 0 ? (
        <View style={[styles.emptyContainer, { paddingBottom: insets.bottom + 32 }]}>
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No notes found' : 'No personal notes yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try a different search term' : 'Tap the + button to add one'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => navigation.navigate('AddEditNote', { noteId: item.id, category: 'personal' })}
              onEdit={() => navigation.navigate('AddEditNote', { noteId: item.id, category: 'personal' })}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingHorizontal: horizontalPadding, paddingBottom: listPaddingBottom },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[
          styles.fab,
          {
            right: fabRight,
            bottom: fabBottom,
            width: fabSize,
            height: fabSize,
            borderRadius: fabSize / 2,
          },
        ]}
        onPress={() => navigation.navigate('AddEditNote', { category: 'personal' })}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 44,
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

