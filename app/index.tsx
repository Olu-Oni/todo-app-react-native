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

  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const todos = useQuery(api.todos.getTodos) || [];
  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
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

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  const renderTodoItem = ({ item, drag, isActive }: RenderItemParams<any>) => (
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
      style={[isActive && { opacity: 0.5 }]}
    >
      <TodoItem
        id={item._id}
        text={item.text}
        completed={item.completed}
        onToggle={() => toggleTodo({ id: item._id as Id<"todos"> })}
        onDelete={() => deleteTodo({ id: item._id as Id<"todos"> })}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* Header with Background */}
      <ImageBackground
        source={
          theme === "dark"
            ? require("../assets/images/bg-desktop-dark.jpg")
            : require("../assets/images/bg-desktop-light.png")
        }
        style={[
          styles.header,
          { flexDirection: "column", alignContent: "center" },
        ]}
      >
        <SafeAreaView
        // style={{marginHorizontal:}}
        >
          <View style={[styles.headerContent, { flex: 1, maxWidth: 540 }]}>
            <Text style={styles.title}>T O D O</Text>
            <ThemeToggle />
          </View>

          {/* Input */}
          <View
            style={[styles.inputContainer, { backgroundColor: cardBackground }]}
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
        </SafeAreaView>
      </ImageBackground>

      {/* Todo List */}

      <View
        style={{
          paddingHorizontal: 24,
          marginTop: -50,
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <View
          style={[styles.listContainer, { backgroundColor: cardBackground }]}
        >
          <DraggableFlatList
            data={filteredTodos}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item._id}
            onDragEnd={({ data }) => handleReorder(data)}
          />
          <View style={[{ backgroundColor: cardBackground, margin: 20, flexDirection:"row", justifyContent:"space-between" }]}>
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
        {/* Footer */}
        <View style={[styles.footer,{ backgroundColor: cardBackground, marginTop: 16, borderRadius:5 }]} >
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
                    { color: filter === f ? tintColor : "#9495A5" },
                    filter === f && styles.filterTextActive,
                  ]}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          
        </View>

        <Text style={[styles.hint, { color: textColor }]}>
          Drag and drop to reorder list
        </Text>
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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
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
  listContainer: {
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    flex: 1,
    maxWidth: 540,
  },
  footer: {
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
  filterContainer: {
    flexDirection: "row",
    flex:1,
    justifyContent:"center",
    gap: 16,
  },
  filterButton: {
    paddingVertical: 4,
    fontWeight:700,
  },
  filterText: {
    fontSize: 14,
  },
  filterTextActive: {
    fontWeight: "bold",
  },
  hint: {
    textAlign: "center",
    marginTop: 48,
    fontSize: 14,
    opacity: 0.5,
  },
});
