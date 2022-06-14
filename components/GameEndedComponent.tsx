import { View, Text, Button, StyleSheet } from "react-native";
import { useSetRecoilState } from "recoil";
import { gameState } from "../game/Game";
import { gameParamsState } from "../state";
import { appStyles, FGColors } from "./styles";

const GameEndedComponent = (
    {gameState}: {gameState: gameState}
) => {

    const setGameParams = useSetRecoilState(gameParamsState);

    const text = gameState === "WON"
    ? "Completed!"
    : "Better luck next time :(";

    return (
        <View style={styles.main}>
            <Text style={styles.text}>{text}</Text>
            <Button
                title="Play Again?"
                color={FGColors.main}
                onPress={()=>{setGameParams(undefined)}}/>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flexDirection: "column",
        justifyContent: "center",
        padding: 22
    },
    text: {
        textAlign: "center",
        margin: 7,
        ...appStyles.text
    }
});

export default GameEndedComponent;
