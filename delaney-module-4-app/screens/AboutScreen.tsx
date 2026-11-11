import { Text, View, StyleSheet } from "react-native";

export default function AboutScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Delaney Yeakle</Text>
      <Text style={styles.subtitle}>
        The Tea Shop is the best place to buy your tea in bulk.
      </Text>
      <Text style={styles.text}>
        Meant to show what teas we sell and their prices.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 36,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
  },
});
