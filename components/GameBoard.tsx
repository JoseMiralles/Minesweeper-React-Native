import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, ScrollView, TouchableOpacity, Vibration } from "react-native";
import { useSetRecoilState } from "recoil";
import Game from "../game/Game";
import { BGColors, FGColors } from "./styles";
import * as Haptics from "expo-haptics";

interface IParams {
    game: Game
}

const GameBoard = ({game}: IParams) => {

    const [totalMoves, setTotalMoves] = useState(0);

    const onPress = ([row, col]: [number, number]) => {
        return () => {
            if (game.board.grid[row][col].number === 0) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }
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

    return (
        <View style={styles.main}>
            <View style={styles.boardWrapper}>
                <FlatList
                    style={styles.board}
                    data={game.board.grid.flat()}
                    numColumns={game.size}
                    columnWrapperStyle={{flexWrap: "nowrap"}}
                    renderItem={({item: square}) => {

                        let text = "";

                        if (square.status === "REVEALED") {

                            if (square.mine) text = "*";
                            else if (square.number !== 0) text = square.number.toString();
                        }
                        else if (square.flagged && square.status === "DEFAULT") {

                            text = "F";
                        }

                        return (
                            <TouchableOpacity
                                onPress={
                                    (square.status !== "REVEALED") ?
                                    onPress(square.pos)
                                    : undefined
                                }
                                onLongPress={
                                    (square.status !== "REVEALED") ?
                                    onLongPress(square.pos)
                                    : undefined
                                }
                                style={[
                                    styles.square,
                                    (square.status === "REVEALED") && styles.revealedSquare
                                ]}>
                                <Text style={{color: FGColors.main}}>
                                    {text}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
    },
    boardWrapper: {
        // flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    board: {
        height: "auto",
    },
    square: {
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        margin: 1,
        backgroundColor: BGColors.secondary,
    },
    revealedSquare: {
        backgroundColor: BGColors.third
    }
});

const colors = ["blue", "blue", "green", "darkgreen", "yellow", "orange", "orangered", "red", "darkred"];

export default GameBoard;
