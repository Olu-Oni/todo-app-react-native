import { ThemeToggle } from "@/components/ThemeToggle";
import { TodoItem } from "@/components/TodoItem";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

type FilterType = "all" | "active" | "completed";

export default function HomeScreen() {
  const { theme } = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBackground = useThemeColor({}, "cardBackground");
  const tintColor = useThemeColor({}, "tint");

  // Debug log
  console.log('Current theme in HomeScreen:', theme);

  // Define background images
  const backgroundImage = theme === "dark"
    ? require("@/assets/images/bg-desktop-dark.jpg")
    : require("@/assets/images/bg-desktop-light.png");

  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const todos = useQuery(api.todos.getTodos) || [];
  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const updateTodo = useMutation(api.todos.updateTodo); // Add this
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const reorderTodos = useMutation(api.todos.reorderTodos);
  const clearCompleted = useMutation(api.todos.clearCompleted);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    await createTodo({ title: newTodo.trim() });
    setNewTodo("");
  };

  const handleReorder = async (data: any[]) => {
    const updates = data.map((item, index) => ({
      id: item._id as Id<"todos">,
      order: index,
    }));
    await reorderTodos({ updates });
  };

  const handleUpdateTodo = async (id: string, newText: string) => {
    await updateTodo({ 
      id: id as Id<"todos">, 
      title: newText 
    });
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .sort((a, b) => {
      // Sort completed tasks to the top
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;
      return 0;
    });

  const activeCount = todos.filter((t) => !t.completed).length;

  const renderTodoItem = ({ item, drag, isActive }: RenderItemParams<any>) => (
    <ScaleDecorator>
      <TodoItem
        id={item._id}
        text={item.title}
        completed={item.completed}
        onToggle={() => toggleTodo({ id: item._id as Id<"todos"> })}
        onDelete={() => deleteTodo({ id: item._id as Id<"todos"> })}
        onEdit={(newText) => handleUpdateTodo(item._id, newText)}
        onLongPress={drag}
        isActive={isActive}
      />
    </ScaleDecorator>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* Header with Background */}
      {theme === "dark" ? (
        <ImageBackground
          source={require("@/assets/images/bg-desktop-dark.jpg")}
          style={styles.header}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerWrapper}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>T O D O</Text>
                <ThemeToggle />
              </View>

              {/* Input */}
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: cardBackground },
                ]}
              >
                <View style={styles.checkboxPlaceholder} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Create a new todo..."
                  placeholderTextColor="#9495A5"
                  value={newTodo}
                  onChangeText={setNewTodo}
                  onSubmitEditing={handleAddTodo}
                  returnKeyType="done"
                />
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      ) : (
        <ImageBackground
          source={require("@/assets/images/bg-desktop-light.png")}
          style={styles.header}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerWrapper}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>T O D O</Text>
                <ThemeToggle />
              </View>

              {/* Input */}
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: cardBackground },
                ]}
              >
                <View style={styles.checkboxPlaceholder} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Create a new todo..."
                  placeholderTextColor="#9495A5"
                  value={newTodo}
                  onChangeText={setNewTodo}
                  onSubmitEditing={handleAddTodo}
                  returnKeyType="done"
                />
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      )}

      {/* Todo List - Centered Content */}
      <View style={styles.contentWrapper}>
        <View style={styles.centeredContent}>
          {/* Todo List Container */}
          <View
            style={[styles.listContainer, { backgroundColor: cardBackground }]}
          >
            <DraggableFlatList
              data={filteredTodos}
              renderItem={renderTodoItem}
              keyExtractor={(item) => item._id}
              onDragEnd={({ data }) => handleReorder(data)}
            />

            {/* Items Left & Clear Completed */}
            <View style={styles.listFooter}>
              <Text style={[styles.footerText, { color: textColor }]}>
                {activeCount} items left
              </Text>
              <TouchableOpacity onPress={() => clearCompleted()}>
                <Text style={[styles.footerText, { color: textColor }]}>
                  Clear Completed
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Buttons */}
          <View
            style={[styles.filterCard, { backgroundColor: cardBackground }]}
          >
            <View style={styles.filterContainer}>
              {(["all", "active", "completed"] as FilterType[]).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilter(f)}
                  style={styles.filterButton}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color: filter === f ? tintColor : "#9495A5",
                        fontWeight: filter === f ? "bold" : "normal",
                      },
                    ]}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Hint Text */}
          <Text style={[styles.hint, { color: textColor }]}>
            Drag and drop to reorder list
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 300,
    width: "100%",
  },
  headerSafeArea: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  headerWrapper: {
    width: "100%",
    maxWidth: 540,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  checkboxPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E3E4F1",
    marginRight: 20,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  centeredContent: {
    width: "100%",
    maxWidth: 540,
    marginTop: -50,
  },
  listContainer: {
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  listFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footerText: {
    fontSize: 14,
  },
  filterCard: {
    marginTop: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    padding: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  filterButton: {
    paddingVertical: 4,
  },
  filterText: {
    fontSize: 14,
  },
  hint: {
    textAlign: "center",
    marginTop: 48,
    fontSize: 14,
    opacity: 0.5,
  },
});