import { View, Text, StyleSheet } from "react-native";
import { RecoilRoot, useRecoilValue } from "recoil";
import GameBoard from "./components/GameBoard";
import NewGameForm from "./components/NewGameForm";
import { gameState } from "./state";

const InnerApp = () => {

  const game = useRecoilValue(gameState);

  return (
    <View style={styleSheet.main}>

    {
      game ?
        <GameBoard game={game}/>
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
