import React, { useState } from "react";
import { StyleSheet, FlatList, SafeAreaView, ScrollView, Platform } from "react-native";
import { ISquare } from "../game/Board";
import Game from "../game/Game";
import { vibrate } from "../util";
import GameEndedComponent from "./GameEndedComponent";
import Square from "./Square";

interface IParams {
    game: Game
}

const useForceBoardUpdate = () => {
    const [val, setVal] = useState(0);
    return () => setVal(val => val + 1);
};

const GameBoard = ({game}: IParams) => {

    const updateBoard = useForceBoardUpdate();

    const gameEnded: boolean = (game.gameStatus() !== "STARTED");
    const gameLost: boolean = (game.gameStatus() === "LOST");

    const onPress = (square: ISquare) => {
        if (square.status === "REVEALED") return undefined;
        return () => {
            if (square.mine) vibrate(3);
            else if (square.number === 0) vibrate(2);
            game.board.digSquare(square.pos[0], square.pos[1]);
            updateBoard();
        };
    };
    
    const onLongPress = (square: ISquare) => {
        if (square.status === "REVEALED") return undefined;
        return () => {
            vibrate(1);
            game.board.toggleFlagSquare(square.pos[0], square.pos[1]);
            updateBoard();
        }
    }

    const content = (
        <>
            <FlatList
                overScrollMode="always"
                contentContainerStyle={styles.board}
                data={game.board.flattenedGrid}
                numColumns={game.size} // n x n grid, so n columns
                renderItem={({ item: square }) => {
                    return (
                        <Square
                            square={ square }
                            isGameLost={ gameLost }
                            onPress={onPress(square)}
                            onLongPress={onLongPress(square)}
                        />
                    );
                }}
            />
        </>
    );

    return (
        <SafeAreaView style={ styles.main }>
            {
                Platform.OS === "android"
                ? <ScrollView style={styles.container} horizontal>{content}</ScrollView>
                : content
            }
            { gameEnded && <GameEndedComponent gameState={game.gameStatus()} /> }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
    },
    flatList: {
    },
    container: {
        flex: 1
    },
    board: { // Flatlist content
        flexGrow: 1,
        // justifyContent: "center"
    },
});

export default GameBoard;
