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
        <View>
            <FlatList
                data={game.board.grid.flat()}
                numColumns={game.size}
                renderItem={({item: square}) => {
                    return (
                        <TouchableOpacity
                            onPress={onPress(square.pos)}
                            style={styles.square}>
                            <Text>
                                {
                                    square.status === "REVEALED"
                                    ? square.number
                                    : "/"
                                }
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "red"
    },
    row: {
        flexDirection: "row",
        backgroundColor: "green",
        // alignItems: "center",
        // justifyContent: "center",
        width: "auto"
    },
    square: {
        padding: 3
    }
});

export default GameBoard;
