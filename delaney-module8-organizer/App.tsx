import {
  Text,
  View,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

type RootStackParamList = {
  Home: undefined;
  Tasks: undefined;
  TaskDetails: { taskId: string; title: string; description: string };
  Settings: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

const STORAGE_KEY = "module8_tasks";

function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) setTasks(JSON.parse(saved));
      } catch (error) {
        Alert.alert("Error", "Unable to load saved tasks.");
      } finally {
        setLoaded(true);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        Alert.alert("Error", "Unable to save tasks.");
      }
    };
    saveTasks();
  }, [tasks, loaded]);

  const addTask = () => {
    const title = titleInput.trim();
    const description = descriptionInput.trim();
    if (!title) {
      Alert.alert("Please fill out all information.");
      return;
    }
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      description: description || undefined,
      completed: false,
    };
    setTasks((current) => [...current, newTask]);
    setTitleInput("");
    setDescriptionInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteConfirm = (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => deleteTask(id) },
    ]);
  };

  const deleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return {
    tasks,
    titleInput,
    setTitleInput,
    descriptionInput,
    setDescriptionInput,
    addTask,
    toggleTask,
    deleteTask,
    deleteConfirm,
  };
}

/* home screen */
function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mobile Task Organizer</Text>
    </SafeAreaView>
  );
}

function TaskDescription({ description }: { description?: string }) {
  if (!description) return null;
  return (
    <View style={styles.taskDetails}>
      <Text style={styles.description}>Description: {description}</Text>
    </View>
  );
}

/* task screen */
type TaskProps = NativeStackScreenProps<RootStackParamList, "Tasks"> & {
  tasks: Task[];
  titleInput: string;
  setTitleInput: (text: string) => void;
  descriptionInput: string;
  setDescriptionInput: (text: string) => void;
  addTask: () => void;
  toggleTask: (id: string) => void;
  deleteConfirm: (id: string) => void;
};
function TasksScreen({
  navigation,
  tasks,
  addTask,
  toggleTask,
  deleteConfirm,
  titleInput,
  setTitleInput,
  descriptionInput,
  setDescriptionInput,
}: TaskProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter task title"
          value={titleInput}
          onChangeText={setTitleInput}
        />
        <TextInput
          placeholder="Enter task description (optional)"
          value={descriptionInput}
          onChangeText={setDescriptionInput}
        />
        <Button title="Add Task" onPress={addTask} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <Text>No tasks available.</Text>}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              <Text style={item.completed ? styles.completed : styles.new}>
                {item.completed ? "✓    " : "○    "}
                {item.title}
              </Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <Button
                title="Details"
                onPress={() =>
                  navigation.navigate("TaskDetails", {
                    taskId: item.id,
                    title: item.title,
                    description: item.description || "n/a",
                  })
                }
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => deleteConfirm(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

/* details screen */
type DetailsProps = NativeStackScreenProps<RootStackParamList, "TaskDetails">;
function TaskDetailsScreen({ route }: DetailsProps) {
  return (
    <View style={styles.container}>
      <Text>Task ID: {route.params.taskId}</Text>
      <View style={styles.taskDetails}>
        <Text style={styles.title}>{route.params.title}</Text>
        <TaskDescription description={route.params.description} />
      </View>
    </View>
  );
}

/* settings screen */
function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </SafeAreaView>
  );
}

function TasksStack() {
  const {
    tasks,
    titleInput,
    setTitleInput,
    descriptionInput,
    setDescriptionInput,
    addTask,
    toggleTask,
    deleteConfirm,
  } = useTaskManager();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Tasks"
        children={(props) => (
          <TasksScreen
            {...props}
            tasks={tasks}
            addTask={addTask}
            toggleTask={toggleTask}
            deleteConfirm={deleteConfirm}
            titleInput={titleInput}
            setTitleInput={setTitleInput}
            descriptionInput={descriptionInput}
            setDescriptionInput={setDescriptionInput}
          />
        )}
      />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </Stack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="TasksStack" component={TasksStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const {} = useTaskManager();

  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    marginTop: 50,
  },
  title: {
    fontSize: 36,
    marginBottom: 50,
    textAlign: "center",
    fontWeight: "bold",
  },
  formContainer: {
    paddingHorizontal: 50,
    marginBottom: 50,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
    fontSize: 18,
    fontWeight: "bold",
  },
  new: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
  },
  taskDetails: {
    marginTop: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "white",
    width: "75%",
    padding: 30,
  },
});
