import { View, StyleSheet } from "react-native";
import { RecoilRoot, useRecoilValue } from "recoil";
import GameBoard from "./components/GameBoard";
import NewGameForm from "./components/NewGameForm";
import { BGColors } from "./components/styles";
import Game from "./game/Game";
import { gameParamsState } from "./state";

const InnerApp = () => {

  const gameParams = useRecoilValue(gameParamsState);

  let game: Game | undefined;
  if (gameParams) game = new Game(gameParams.size, gameParams.totalMines);

  return (
    <View style={styleSheet.main}>

    {
      game !== undefined ?
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
    flexGrow: 1,
    backgroundColor: BGColors.main
  },
  text: {
    color: "red",
    alignSelf: "center" 
  }
});

export default App;
