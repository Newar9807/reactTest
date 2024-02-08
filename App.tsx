import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Chess from "./Chess";

export default function App() {
  return (
    <View style={styles.container}>
      {/* {Chess()} */}
      <View style={styles.innerContainer}>{Chess()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
    // justifyContent: "center",
    // alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    marginVertical: "50%",
    // paddingHorizontal: 10,
    // borderRadius: 10,
  },
});
