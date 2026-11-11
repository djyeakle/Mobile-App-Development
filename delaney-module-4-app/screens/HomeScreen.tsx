import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Tea Shop</Text>
      <Text style={styles.subtitle}>
        Welcome to The Tea Shop, we're glad you're here!
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Products"
          color="#462b5c"
          onPress={() => navigation.navigate("Products")}
        />
        <Button
          title="About"
          color="#462b5c"
          onPress={() => navigation.navigate("About")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
});
