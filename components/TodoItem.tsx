import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newText: string) => void;
}

export function TodoItem({ id, text, completed, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const textSlashed = useThemeColor({}, 'textSlashed');
  const borderColor = useThemeColor({}, 'checkboxBorder');

  const handleSubmit = () => {
    if (editText.trim() !== '' && editText !== text) {
      onEdit(editText.trim());
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    if (editText.trim() === '') {
      setEditText(text); // Revert if empty
    } else {
      handleSubmit();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
        {completed ? (
          <LinearGradient
            colors={['#55DDFF', '#C058F3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkboxChecked}
          >
            <Ionicons name="checkmark" size={16} color="#FFF" />
          </LinearGradient>
        ) : (
          <View style={[styles.checkboxUnchecked, { borderColor }]} />
        )}
      </TouchableOpacity>

      <TextInput
        style={[
          styles.textInput,
          {
            color: completed ? textSlashed : textColor,
            textDecorationLine: completed ? 'line-through' : 'none',
          },
        ]}
        value={editText}
        onChangeText={setEditText}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        blurOnSubmit={true}
        editable={!completed} // Optional: prevent editing completed todos
      />

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="close" size={18} color="#9495A5" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  checkbox: {
    marginRight: 20,
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    padding: 0, // Remove default padding
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});