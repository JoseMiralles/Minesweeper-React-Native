import React, { useState } from "react";
import { StyleSheet, FlatList, Text, TouchableOpacity, Vibration, SafeAreaView, ViewStyle, TextStyle, ScrollView, Platform } from "react-native";
import Game from "../game/Game";
import { BGColors, FGColors } from "./styles";
import * as Haptics from "expo-haptics";
import GameEndedComponent from "./GameEndedComponent";
import { ISquare } from "../game/Board";

//#region Rendering

interface IParams {
    game: Game
}

const GameBoard = ({game}: IParams) => {

    const [totalMoves, setTotalMoves] = useState(0);

    const gameEnded: boolean = (game.gameStatus() !== "STARTED");
    const gameLost: boolean = (game.gameStatus() === "LOST");

    const onPress = ([row, col]: [number, number]) => {
        return () => {
            if (game.board.grid[row][col].mine) vibrate(3);
            else if (game.board.grid[row][col].number === 0) vibrate(2);

            game.board.digSquare(row, col);
            setTotalMoves(totalMoves + 1);
        };
    };
    
    const onLongPress = ([row, col]: [number, number]) => {
        return () => {
            vibrate(1);
            game.board.toggleFlagSquare(row, col);
            setTotalMoves(totalMoves + 1);
        }
    }

    const content = (
        <>
            <FlatList
                overScrollMode="always"
                contentContainerStyle={styles.board}
                data={game.board.grid.flat()}
                numColumns={game.size} // n x n grid, so n columns
                renderItem={({ item: square }) => {

                    const {text, styleKey, textStyleKey} = getTextAndStyle(square, gameLost);

                    return (
                        <TouchableOpacity
                            onPress={
                                (square.status !== "REVEALED" && !gameEnded)
                                    ? onPress(square.pos)
                                    : undefined
                            }
                            onLongPress={
                                (square.status !== "REVEALED" && !gameEnded)
                                    ? onLongPress(square.pos)
                                    : undefined
                            }
                            style={ squareStyles[styleKey]} >
                            <Text style={ squareTextStyles[textStyleKey] }>
                                {text}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </>
    );

    return (
        <SafeAreaView
            style={styles.main}
        >
            {
                Platform.OS === "android"
                ? <ScrollView style={styles.container} horizontal>{content}</ScrollView>
                : content
            }
            { gameEnded && <GameEndedComponent gameState={game.gameStatus()} /> }
        </SafeAreaView>
    );
};

/**
 * Vibrates based on the provided setting.
 * Attempts to do so only on ios and android.
 */
const vibrate = (
    strength: 1 | 2 | 3
) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
        switch (strength){
            case 1:
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
            case 2:
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
            case 3:
                Vibration.vibrate(2000);
            break;
        }
    }
}

/**
 * Returns the correct text, and styling for each square.
 * TODO: Replace this with memoization.
 */
const getTextAndStyle =(
    square: ISquare, gameLost: boolean
): {text: string; styleKey: keyof typeof squareStyles; textStyleKey: keyof typeof squareTextStyles} => {

    /**
     * All the mines need to be shown if the game is lost.
     */
    if (square.mine && gameLost)
        return {
            text: "*",
            styleKey: "mine",
            textStyleKey: "mine"
        }

    /**
     * Show revealed square. Do not show number for "0" squares.
     */
    if (square.status === "REVEALED")
        return {
            text: square.number !== 0 ? square.number.toString() : "",
            styleKey: "revealed",
            textStyleKey: "revealed"
        }
    
    /**
     * Flagged squares
     */
    if (square.flagged && square.status === "DEFAULT")
        return {
            text: "F",
            styleKey: "flagged",
            textStyleKey: "flagged"
        };

    /**
     * Default squares (not revealed, or flagged)
     */
    return {
        text: "",
        styleKey: "square",
        textStyleKey: "default"
    };
};

//#endregion

//#region Styling

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

const defaultSquare: ViewStyle | TextStyle = {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    backgroundColor: BGColors.secondary,
};

/**
 * This is used to avoid having to merge styles whenever each square is rendered.
 */
const squareStyles = StyleSheet.create({
    square: defaultSquare,
    revealed: {
        ...defaultSquare,
        backgroundColor: BGColors.third
    },
    mine: {
        ...defaultSquare,
        backgroundColor: FGColors.main,
    },
    flagged: {
        ...defaultSquare,
    }
});

const squareTextStyles = StyleSheet.create({
    mine: {
        fontWeight: "bold",
        fontSize: 30,
        lineHeight: 45,
        color: BGColors.third
    },
    revealed: {
        color: FGColors.main
    },
    flagged: {
        color: FGColors.main,
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: 20
    },
    default: {}
});

//#endregion

export default GameBoard;
