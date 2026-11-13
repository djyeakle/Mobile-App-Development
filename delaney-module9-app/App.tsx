import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
} from "react-native";
import sampleData from "./data/teams.json";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [teams, setTeams] = useState<
    { id: string; name: string; city: string; conference: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function restoreFavorites() {
      try {
        const saved = await AsyncStorage.getItem("favoriteTeams");
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Could not restore favorites", err);
      }
    }
    restoreFavorites();
  }, []);

  async function toggleFavorites(id: string) {
    const next = favorites.includes(id)
      ? favorites.filter((value) => value !== id)
      : [...favorites, id];
    try {
      await AsyncStorage.setItem("favoriteTeams", JSON.stringify(next));
      setFavorites(next);
    } catch (err) {
      console.warn("Could not save favorites", err);
    }
  }

  async function showPlayers(id: string) {
    const team = sampleData.teams.find((team) => team.id === id);

    if (team) {
      const playerNames = team.players
        .map(
          (player) => `${player.name} (${player.position}, #${player.number})`
        )
        .join("\n");
      Alert.alert(`Players from ${team.name}`, playerNames);
    } else {
      Alert.alert("Error", "Team not found!");
    }
  }

  async function searchTeams(query: string) {
    if (!query) {
      Alert.alert("Error", "Please enter a team name or city to search.");
      return;
    }

    const filteredTeams = sampleData.teams.filter(
      (team) =>
        team.name.toLowerCase().includes(query.toLowerCase()) ||
        team.city.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredTeams.length > 0) {
      setTeams(filteredTeams);
    } else {
      Alert.alert("No Results", "No teams found matching your search.");
    }
  }

  useEffect(() => {
    async function loadTeams() {
      try {
        setTeams(sampleData.teams);
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>NFL Teams</Text>
      <View style={styles.search}>
        <TextInput
          style={styles.searchPlaceholder}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        ></TextInput>
        <View style={styles.searchButton}>
          <Button
            color="#d6070c"
            title="Search"
            onPress={() => {
              searchTeams(searchQuery);
            }}
          />
        </View>
      </View>
      <FlatList
        data={teams}
        keyExtractor={(team) => team.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.team}>{item.name}</Text>
            <Text>
              {item.city} * {item.conference}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                color="#02336a"
                title={
                  favorites.includes(item.id)
                    ? "Remove Favorite"
                    : "Add Favorite"
                }
                onPress={() => toggleFavorites(item.id)}
              />
              <Button
                title="Show Players"
                onPress={() => showPlayers(item.id)}
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: "#eaf1f8",
    borderRadius: 10,
    marginBottom: 10,
  },
  team: {
    fontSize: 18,
    fontWeight: "600",
  },
  buttonContainer: {
    justifyContent: "center",
    marginTop: 10,
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  search: {
    padding: 20,
  },
  searchPlaceholder: {
    fontSize: 20,
  },
  searchButton: {
    paddingHorizontal: 50,
  },
});
