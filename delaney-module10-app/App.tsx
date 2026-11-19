import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Image,
  Text,
  View,
  Alert,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@location_journal_entries";

export default function App() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<
    Array<{
      id: string;
      note: string;
      photoUri: string;
      latitude: number;
      longitude: number;
      timestamp: string;
    }>
  >([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setEntries(JSON.parse(raw));
      })
      .catch(() => Alert.alert("Error", "Could not load journal"));
  }, []);

  async function takePhoto() {
    try {
      const result = await cameraRef.current?.takePictureAsync();
      if (result?.uri) {
        setPhotoUri(result.uri);
        setShowCamera(false);
      }
    } catch {
      Alert.alert("Camera error", "Could not take a photo.");
    }
  }

  async function readLocation() {
    setBusy(true);
    try {
      console.log("Requesting location permissions...");
      const response = await Location.requestForegroundPermissionsAsync();
      console.log("Permission response:", response);

      if (response.status !== "granted") {
        Alert.alert("Permission denied", "Location access is optional.");
        return;
      }
      // actual gps does not work with emulator, used hardcoded instead
      // const result = await Location.getCurrentPositionAsync({
      // accuracy: Location.Accuracy.Balanced,
      // });
      console.log("Setting hardcoded coordinates...");
      setCoords({
        latitude: 37.7749, //result.coords.latitude,
        longitude: -122.4194, //result.coords.longitude,
      });
      console.log("Coordinates set successfully.");
    } catch (error) {
      console.error("Error in readLocation", error);
      Alert.alert("GPS error", "Unable to determine location.");
    } finally {
      setBusy(false);
    }
  }

  async function saveJournal() {
    if (!photoUri || !coords) {
      Alert.alert("Missing data", "Capture a photo and retrieve location.");
      return;
    }
    setBusy(true);
    let storedPhoto = null;
    try {
      const id = String(Date.now());
      const destination = FileSystem.documentDirectory + id + ".jpg";
      await FileSystem.copyAsync({ from: photoUri, to: destination });
      storedPhoto = destination;
      const entry = {
        id,
        note: note.trim(),
        photoUri: destination,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
      };
      const updated = [entry, ...entries];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEntries(updated);
      setPhotoUri(null);
      setCoords(null);
      setNote("");
      Alert.alert("Saved", "Journal entry saved locally.");
    } catch {
      if (storedPhoto) {
        // optional
      }
      Alert.alert("Save error", "Could not save journal entry.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Location Journal</Text>
      {!permission ? (
        <Text>Checking camera permission...</Text>
      ) : showCamera && permission.granted ? (
        <View>
          <CameraView style={styles.camera} ref={cameraRef} facing="back" />
          <Button title="Capture Photo" onPress={takePhoto} />
          <Button title="Cancel" onPress={() => setShowCamera(false)} />
        </View>
      ) : (
        <View>
          <Button
            title="Open Camera"
            onPress={async () => {
              if (permission.granted) setShowCamera(true);
              else {
                const response = await requestPermission();
                if (response.granted) setShowCamera(true);
                else
                  Alert.alert(
                    "Camera denied",
                    "Enable camera in device settings."
                  );
              }
            }}
          />
          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          )}
          <Button
            title="Get Current Location"
            onPress={readLocation}
            disabled={busy}
          />
          {coords && (
            <Text>
              Latitude: {coords.latitude.toFixed(5)} | Longitude:{" "}
              {coords.longitude.toFixed(5)}
            </Text>
          )}
          <TextInput
            placeholder="Journal note"
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />
          <Button title="Save Entry" onPress={saveJournal} disabled={busy} />
          <Text style={styles.subheading}>Saved Entries</Text>
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>No entries yet.</Text>}
            renderItem={({ item }) => (
              <View style={styles.entry}>
                <Image
                  source={{ uri: item.photoUri }}
                  style={styles.thumbnail}
                />
                <Text>{item.note || "Untitled entry"}</Text>
                <Text>{new Date(item.timestamp).toLocaleString()}</Text>
                <Text>
                  {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 16,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  camera: {
    height: 260,
    marginVertical: 10,
  },
  photo: {
    height: 180,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 12,
    marginVertical: 12,
  },
  entry: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  thumbnail: {
    width: 100,
    height: 80,
    marginBottom: 6,
  },
});
