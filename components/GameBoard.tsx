import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, ScrollView, TouchableOpacity, Vibration, SafeAreaView } from "react-native";
import { useSetRecoilState } from "recoil";
import Game from "../game/Game";
import { BGColors, FGColors } from "./styles";
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

                    const {text, styleKey} = getTextAndStyle(square, gameLost);

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
                            style={squareStyles[styleKey]}>
                            <Text style={{ color: squareStyles[styleKey].color }}>
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

const getTextAndStyle =
    (square: ISquare, gameLost: boolean):
    {text: string; styleKey: keyof typeof squareStyles} => {

    if (square.mine && gameLost)
    return {
        text: "*",
        styleKey: "mine"
    }

    if (square.status === "REVEALED" && square.number !== 0)
        return {
            text: square.number.toString(),
            styleKey: "revealed"
        }
    
    if (square.flagged && square.status === "DEFAULT")
        return {
            text: "F",
            styleKey: "flagged"
        };

    return {
        text: "",
        styleKey: "square"
    };
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: "center"
    },
    board: {},
    square: {
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        margin: 1,
        backgroundColor: BGColors.secondary,
        color: FGColors.main
    },
    revealedSquare: {
        backgroundColor: BGColors.third
    },
    mine: {
        backgroundColor: FGColors.warning,
        fontWeight: "bold",
        fontSize: 30
    },
    flagged: {
        color: FGColors.warning
    }
});

/**
 * Used to avoid mergin styles for every square in the board.
 */
const squareStyles = StyleSheet.create({
    square: styles.square,
    revealed: {
        ...styles.square,
        ...styles.revealedSquare
    },
    mine: {
        ...styles.square,
        ...styles.mine
    },
    flagged: {
        ...styles.square,
        ...styles.flagged
    }
});

export default GameBoard;
