import { View, Text, StyleSheet } from "react-native";

const App = () => {
  return (
    <View style={styleSheet.main}>
      <Text style={styleSheet.text}>Helloooo!</Text>
    </View>
  );
};

const styleSheet = StyleSheet.create({
  main: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    flexGrow: 1
  },
  text: {
    color: "red",
    alignSelf: "center" 
  }
});

export default App;
