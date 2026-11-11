import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Alert, Button, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  /*
    use states
  */
  const [guests, setGuests] = useState(0);
  const [text, onChangeText] = useState("");

  /*
    functions to add and remove guests so the user can pick how many they want
  */
  const addGuest = () => {
    setGuests(guests + 1);
  };

  const removeGuest = () => {
    if (guests > 0) {
      setGuests(guests - 1);
    }
  };

  /*
    function to decide what message to alert based on user input
  */
  const register = () => {
    if (guests === 0 && (text === "" || text === null)) {
      Alert.alert(
        "Unable to Register",
        "Please enter the name you would like to register under and ensure you have selected at least one guest.."
      );
    } else if (text === "" || text === null) {
      Alert.alert(
        "Unable to Register",
        "Please enter the name you would like to register under."
      );
    } else if (guests === 0) {
      Alert.alert(
        "Unable to Register",
        "You must have at least one guest to register."
      );
    } else {
      Alert.alert(
        "Registration Complete",
        `Thank you, ${text}. Please check email for confirmation.`
      );
    }
  };

  /*
    component to render the image - can make to use props if wanted
  */
  function ImageSection() {
    return (
      <Image
        source={require("@/assets/images/strongBlackTeaCup.png")}
        style={styles.image}
      ></Image>
    );
  }

  /*
    component to create the event title section based on the event title prop
  */
  function EventTitleSection({ eventTitle }: { eventTitle: string }) {
    return (
      <View>
        <Text style={styles.title}>Event: </Text>
        <Text style={styles.subtitle}>{eventTitle}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <EventTitleSection eventTitle="Tea Enthusiast Convention" />
        <ImageSection />

        <TextInput
          onChangeText={onChangeText}
          placeholder="Enter Full Name"
          style={styles.input}
          value={text}
        ></TextInput>
        <Text style={styles.text}>Guests: {guests}</Text>

        <View style={styles.buttonView}>
          <Button title="Add Guest" onPress={addGuest} color="#462b5c"></Button>
          <Button
            title="Remove Guest"
            onPress={removeGuest}
            color="#462b5c"
          ></Button>
        </View>
        <View style={styles.buttonView}>
          <Button title="Register" onPress={register} color="#462b5c"></Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fefffa",
    height: "100%",
  },
  title: {
    fontSize: 54,
    fontWeight: "bold",
    color: "#462b5c",
  },
  subtitle: {
    fontSize: 34,
    textAlign: "center",
    textDecorationLine: "underline",
    padding: 10,
    paddingBottom: 50,
    color: "#462b5c",
  },
  input: {
    fontSize: 20,
    borderWidth: 2,
    borderColor: "#462b5c",
    color: "#462b5c",
    marginTop: 30,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#462b5c",
    textAlign: "center",
    marginTop: 30,
  },
  image: {
    height: 200,
    width: 200,
    alignSelf: "center",
    borderRadius: 20,
    borderColor: "#462b5c",
    borderWidth: 5,
  },
  buttonView: {
    padding: 40,
    gap: 10,
  },
});
