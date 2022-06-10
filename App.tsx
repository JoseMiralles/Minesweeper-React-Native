import { View, Text, StyleSheet } from "react-native";
import Game from "./game/Game";

const App = () => {

  const game = new Game(5, 10);

  return (
    <View style={styleSheet.main}>
      <Text style={styleSheet.text}>
        {game.board.print()}
      </Text>
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
