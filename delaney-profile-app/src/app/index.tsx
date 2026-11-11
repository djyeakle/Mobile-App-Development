import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function TechSection() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Technical Skills</Text>

      <Text style={styles.plainText}>
        HTML, CSS, JavaScript, TypeScript, React, GitHub, PHP, C#, and
        PostgreSQL
      </Text>
    </View>
  );
}

function CareerGoals() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Career Goals</Text>

      <Text style={styles.plainText}>
        I want to become a frontend web developer who creates educational video
        games on the side. I want to be able to help people while also doing
        what I love.
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Delaney Yeakle</Text>

      <View style={styles.mainCard}>
        <Text style={styles.sectionTitle}>Profile Overview</Text>

        <Text style={styles.plainText}>Age: 22</Text>

        <Text style={styles.plainText}>Location: Millsboro, DE</Text>

        <Text style={styles.plainText}>Email: djyeakl@pointpark.edu</Text>

        <Text style={styles.plainText}>
          Favorite Programming Languages: HTML and CSS
        </Text>

        <Text style={styles.plainText}>
          Career Interest: Frontend Web Developer
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Education</Text>

        <Text style={styles.plainText}>School: Point Park University</Text>

        <Text style={styles.plainText}>Major: Applied Computer Science</Text>

        <Text style={styles.plainText}>Minor: Accounting</Text>

        <Text style={styles.plainText}>Class: Senior</Text>
      </View>

      <TechSection />

      <CareerGoals />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#aac5f2",
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
  },

  card: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 15,
  },

  mainCard: {
    padding: 20,
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: "#cedcf2",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  plainText: {
    fontSize: 14,
    fontWeight: "regular",
    color: "black",
  },
});

export default App;
