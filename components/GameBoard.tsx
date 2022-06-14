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
            console.log(game.board.print());
            setTotalMoves(totalMoves + 1);
        };
    };
    
    return (
        <View style={styles.main}>
            <View style={styles.boardWrapper}>
                <FlatList
                    style={styles.board}
                    data={game.board.grid.flat()}
                    numColumns={game.size}
                    renderItem={({item: square}) => {
                        return (
                            <TouchableOpacity
                                onPress={onPress(square.pos)}
                                style={[
                                    styles.square,
                                    (square.status === "REVEALED") && styles.revealedSquare
                                ]}>
                                {square.status === "REVEALED" &&
                                    <Text style={{color: colors[square.number]}}>
                                        {square.number !== 0 ? square.number : ""}
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
        alignContent: "center"
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
        width: 27,
        height: 27,
        justifyContent: "center",
        alignItems: "center",
        margin: 1,
        backgroundColor: "silver",
    },
    revealedSquare: {
        backgroundColor: "gray"
    }
});

const colors = ["blue", "green", "darkgreen", "yellow", "orange", "orangered", "red", "darkred"];

export default GameBoard;
