import { IconArrowLeft } from "@tabler/icons-react-native";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface ToolbarProps {
  title: string;
  onPress: () => void;
}

export default function Toolbar({ title, onPress }: ToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={onPress} style={styles.leftAction}>
        <IconArrowLeft size={25} color={"black"} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      <View style={styles.rightActionPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: "white",
    height: 55,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#767676",
    marginBottom: 10,
  },
  leftAction: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black", 
  },
  rightActionPlaceholder: {
    width: 40,
    height: 40,
  },
});
