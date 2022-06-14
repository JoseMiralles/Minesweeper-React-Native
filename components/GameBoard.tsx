import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, ScrollView, TouchableOpacity, Vibration, SafeAreaView, ViewStyle, TextStyle } from "react-native";
import { useSetRecoilState } from "recoil";
import Game from "../game/Game";
import { appStyles, BGColors, FGColors } from "./styles";
import * as Haptics from "expo-haptics";
import GameEndedComponent from "./GameEndedComponent";
import { ISquare } from "../game/Board";

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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            game.board.toggleFlagSquare(row, col);
            setTotalMoves(totalMoves + 1);
        }
    }

    const content = (
        <>
            <FlatList
                style={styles.board}
                data={game.board.grid.flat()}
                numColumns={game.size}
                columnWrapperStyle={{ flexWrap: "nowrap" }}
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

    if (gameEnded)
        return (
            <SafeAreaView style={styles.main}>
                {content}
                <GameEndedComponent gameState={game.gameStatus()} />
            </SafeAreaView>
        );

    return (
        <View style={styles.main}>
            {content}
        </View>
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

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: "center"
    },
    board: { // Flatlist
        padding: 100
    },
    square: {
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        margin: 1,
        backgroundColor: BGColors.secondary,
        color: FGColors.main
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
 * Used to avoid mergin styles for every square in the board.
 */
const squareStyles = StyleSheet.create({
    square: defaultSquare,
    revealed: {
        ...defaultSquare,
        backgroundColor: BGColors.third
    },
    mine: {
        ...styles.square,
        backgroundColor: FGColors.main,
    },
    flagged: {
        ...styles.square,
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

export default GameBoard;
