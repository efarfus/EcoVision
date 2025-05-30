import { Image, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";

interface BoxFavsProps {
  latitude: number;
  longitude: number;
  description: string;
  uri: string;
  onPress: () => void;
}

export default function BoxFavs({
  latitude,
  longitude,
  description,
  uri,
  onPress,
}: BoxFavsProps) {
  return (
    <TouchableOpacity style={styles.boxContainer} onPress={onPress}>
      <Image source={{ uri: uri }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{latitude + ", " + longitude}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
  },
});
