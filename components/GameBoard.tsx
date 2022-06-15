import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Vibration, SafeAreaView, ViewStyle, TextStyle, LayoutChangeEvent } from "react-native";
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
            if (game.board.grid[row][col].mine)
                Vibration.vibrate(3000);
            else if (game.board.grid[row][col].number === 0)
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            game.board.digSquare(row, col);
            setTotalMoves(totalMoves + 1);
        };
    };
    
    const onLongPress = ([row, col]: [number, number]) => {
        return () => {
            console.log("LONG PRESS");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            game.board.toggleFlagSquare(row, col);
            setTotalMoves(totalMoves + 1);
        }
    }

    const content = (
        <>
            <FlatList
                contentContainerStyle={styles.board}
                style={styles.flatList}
                data={game.board.grid.flat()}
                numColumns={game.size} // n x n grid, so n columns
                // columnWrapperStyle={{ flexWrap: "nowrap" }}
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
            { content }
            { gameEnded && <GameEndedComponent gameState={game.gameStatus()} /> }
        </SafeAreaView>
    );
};

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
        // flexGrow: 1,
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "black",
    },
    flatList: {
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
