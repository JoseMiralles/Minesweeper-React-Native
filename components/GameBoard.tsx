import React from "react";
import { View, StyleSheet, FlatList, Text, ScrollView } from "react-native";
import Game from "../game/Game";

interface IParams {
    game: Game
}

const GameBoard = ({game}: IParams) => {
    
    return (
        <View>
            <ScrollView>
                {game.board.grid.map((row, idx) => {

                    return (
                        <FlatList
                            key={idx}
                            horizontal={true}
                            data={row}
                            style={styles.row}
                            renderItem={({item: square}) => {

                                return (
                                    <View
                                        style={styles.square}
                                    >
                                        <Text>
                                            {square.number}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    );
                })}
            </ScrollView>
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
