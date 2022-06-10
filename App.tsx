import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RecoilRoot, useRecoilState } from "recoil";
import NewGameForm from "./components/NewGameForm";
import Game from "./game/Game";
import { gameState } from "./state";

const InnerApp = () => {

  const [game] = useRecoilState(gameState);

  return (
    <View style={styleSheet.main}>

    {
      game ?
        <Text>{game.board.print()}</Text>
        : <NewGameForm />
    }

  </View>
  );
};

const App = () => {

  return (
    <RecoilRoot>
      <InnerApp/>
    </RecoilRoot>
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
