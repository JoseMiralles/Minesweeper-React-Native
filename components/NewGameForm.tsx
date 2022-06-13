import React, { useState } from "react";
import { TextInput, View, Text, Button, StyleSheet } from "react-native";
import { useSetRecoilState } from "recoil";
import Game from "../game/Game";
import { gameParamsState } from "../state";

const NewGameForm = () => {

    const [size, setSize] = useState(10);
    const [totalMines, setTotalMines] = useState(2);
    const [errors, setErrors] = useState<string[]>([]);

    const setGameParams = useSetRecoilState(gameParamsState);

    const createGame = () => {
        if ((size * size) < totalMines) {
            setErrors(["There are more mines than squares!"]);
        } else {
            setGameParams({ size, totalMines });
        }
    };

    return (
        <View style={styles.main}>

            <View>
                {errors.map((e,i) => (<Text style={styles.error} key={i}>{e}</Text>))}
            </View>

            <Text style={styles.label}>Board Size:</Text>
            <TextInput
                keyboardType="numeric"
                style={styles.TextInput}
                value={size.toString()}
                onChangeText={(e)=>{setSize((e as unknown as number))}}/>

            <Text style={styles.label}>Total Mines:</Text>
            <TextInput
                keyboardType="numeric"
                style={styles.TextInput}
                value={totalMines.toString()}
                onChangeText={(e)=>{setTotalMines((e as unknown as number))}}
            />

            <Button
                title="play"
                onPress={createGame}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        margin: 25,
        padding: 25,
        justifyContent: "center",
        alignContent: "center",
    },
    label: {
        color: "dimgray"
    },
    TextInput: {
        padding: 10,
        borderColor: "dimgray",
        borderWidth: 1,
        marginTop: 6,
        marginBottom: 15
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: 12
    }
});

export default NewGameForm;
