import { StyleSheet, Button, Text, View } from "react-native";

export default function ProductsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Peppermint Tea</Text>
        <Text style={styles.price}>$17/lb</Text>
        <Button
          title="View Details"
          color="#462b5c"
          onPress={() =>
            navigation.navigate("Details", {
              productName: "Peppermint Tea",
              price: "$17/lb",
            })
          }
        ></Button>
      </View>
      <View>
        <Text style={styles.title}>Caramel Black Tea</Text>
        <Text style={styles.price}>$23/lb</Text>
        <Button
          title="View Details"
          color="#462b5c"
          onPress={() =>
            navigation.navigate("Details", {
              productName: "Caramel Black Tea",
              price: "$23/lb",
            })
          }
        ></Button>
      </View>
      <View>
        <Text style={styles.title}>Sleepytime Tea</Text>
        <Text style={styles.price}>$10/lb</Text>
        <Button
          title="View Details"
          color="#462b5c"
          onPress={() =>
            navigation.navigate("Details", {
              productName: "Sleepytime Tea",
              price: "$10/lb",
            })
          }
        ></Button>
      </View>
      <View>
        <Text style={styles.title}>Pomegranate Green Tea</Text>
        <Text style={styles.price}>$12/lb</Text>
        <Button
          title="View Details"
          color="#462b5c"
          onPress={() =>
            navigation.navigate("Details", {
              productName: "Pomegranate Green Tea",
              price: "$12/lb",
            })
          }
        ></Button>
      </View>
      <View>
        <Text style={styles.title}>Lemon Herbal Tea</Text>
        <Text style={styles.price}>$16/lb</Text>
        <Button
          title="View Details"
          color="#462b5c"
          onPress={() =>
            navigation.navigate("Details", {
              productName: "Lemon Herbal Tea",
              price: "$16/lb",
            })
          }
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
