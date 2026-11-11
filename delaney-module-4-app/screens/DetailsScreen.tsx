import { Text, View, StyleSheet } from "react-native";

export default function DetailsScreen({ route }: any) {
  const { productName, price } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productName}</Text>
      <Text style={styles.price}>{price}</Text>
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
    textAlign: "center",
    fontWeight: "bold",
  },
  price: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
});
