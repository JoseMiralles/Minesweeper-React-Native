import React, { useEffect } from "react";
import { View, StyleSheet, FlatList, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSetRecoilState } from "recoil";
import Game from "../game/Game";
import { gameState } from "../state";

interface IParams {
    game: Game
}

const GameBoard = ({game}: IParams) => {

    const setGame = useSetRecoilState(gameState);

    const onPress = ([row, col]: [number, number]) => {
        return () => {
            console.log(`[${row}, ${col}]`);
            game.board.modifySquare(
                row, col, "REVEALED"
            )
            setGame(game);
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
