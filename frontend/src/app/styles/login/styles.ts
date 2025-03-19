import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#000000",
  },
  signup: {
    color: "#17950E",
    fontSize: 20,
    textAlign: "center",
  },
  logo: {
    width: 200,
    height: 212,
    alignSelf: "center",
  },
  line: {
    height: 1,
    backgroundColor: "#000000",
    opacity: 0.2,
    marginVertical: 20,
    width: "50%",
    alignSelf: "center",
    marginTop:-15
  },
});

export default styles;
