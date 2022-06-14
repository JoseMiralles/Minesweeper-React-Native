import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSetRecoilState } from "recoil";
import Game from "../game/Game";

interface IParams {
    game: Game
}

const GameBoard = ({game}: IParams) => {

    const [totalMoves, setTotalMoves] = useState(0);

    const onPress = ([row, col]: [number, number]) => {
        return () => {
            game.board.digSquare(row, col);
            setTotalMoves(totalMoves + 1);
        };
    };
    
    const onLongPress = ([row, col]: [number, number]) => {
        return () => {
            game.board.toggleFlagSquare(row, col);
            debugger;
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
                        if (square.mine) text = "*";
                        else if (square.number !== 0) text = square.number.toString();
                        if (square.flagged) text = "F";

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
                                {square.status === "REVEALED" &&
                                    <Text style={{color: colors[square.number]}}>
                                        {text}
                                    </Text>
                                }
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
        backgroundColor: "silver"
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
        backgroundColor: "darkgray",
    },
    revealedSquare: {
        backgroundColor: "white"
    }
});

const colors = ["blue", "blue", "green", "darkgreen", "yellow", "orange", "orangered", "red", "darkred"];

export default GameBoard;
