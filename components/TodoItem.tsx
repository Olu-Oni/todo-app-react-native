import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
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
  onLongPress?: () => void;
  isActive?: boolean;
}

export function TodoItem({ 
  id, 
  text, 
  completed, 
  onToggle, 
  onDelete, 
  onEdit,
  onLongPress,
  isActive = false
}: TodoItemProps) {
  const [editText, setEditText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const textSlashed = useThemeColor({}, 'textSlashed');
  const borderColor = useThemeColor({}, 'checkboxBorder');

  // Update local state when prop changes (important for reordering)
  useEffect(() => {
    setEditText(text);
  }, [text]);

  const handleSubmit = () => {
    const trimmedText = editText.trim();
    if (trimmedText !== '' && trimmedText !== text) {
      onEdit(trimmedText);
    } else if (trimmedText === '') {
      setEditText(text); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleTextAreaPress = () => {
    if (completed || isActive) return;

    tapCountRef.current += 1;

    if (tapCountRef.current === 1) {
      // First tap - start timer
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 300);
    } else if (tapCountRef.current === 2) {
      // Second tap - enable editing
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
      tapCountRef.current = 0;
      
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={500}
      style={[
        styles.container, 
        { backgroundColor },
        isActive && styles.activeContainer
      ]}
    >
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

      <Pressable 
        style={styles.textContainer}
        onPress={handleTextAreaPress}
      >
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={[
              styles.textInput,
              {
                color: textColor,
              },
            ]}
            value={editText}
            onChangeText={setEditText}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            blurOnSubmit={true}
            autoFocus
          />
        ) : (
          <Text
            style={[
              styles.text,
              {
                color: completed ? textSlashed : textColor,
                textDecorationLine: completed ? 'line-through' : 'none',
              },
            ]}
          >
            {text}
          </Text>
        )}
      </Pressable>

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="close" size={18} color="#9495A5" />
      </TouchableOpacity>
    </Pressable>
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
  activeContainer: {
    opacity: 0.7,
    elevation: 8,
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
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
  textInput: {
    fontSize: 18,
    padding: 0,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});