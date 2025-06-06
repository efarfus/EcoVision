import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

interface BoxFavsProps {
  latitude: number;
  longitude: number;
  description: string;
  uri: string;
  onPress: () => void;
  onDeletePress: () => void; 
}

export default function BoxFavs({
  latitude,
  longitude,
  description,
  uri,
  onPress,
  onDeletePress, 
}: BoxFavsProps) {
  return (
    <View style={styles.boxContainer}>
      <TouchableOpacity style={styles.contentContainer} onPress={onPress}>
        <Image source={{ uri: uri }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{latitude + ", " + longitude}</Text>
          <Text style={styles.descriptionText} numberOfLines={2}>{description}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress}>
        <Ionicons name="trash-bin" size={24} color="#D9534F" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
    padding: 10, 
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
    paddingRight: 25, 
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
  deleteButton: {
    position: 'absolute', 
    top: 5,
    right: 5,
    padding: 5, 
    zIndex: 1,
  },
});