import React, { useEffect, useState } from "react";
import { TextInput, View, Text, Button, StyleSheet, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { useSetRecoilState } from "recoil";
import Game from "../game/Game";
import { gameParamsState } from "../state";
import { BGColors, FGColors, appStyles } from "./styles";

const NewGameForm = () => {

    const [size, setSize] = useState(20);
    const [totalMines, setTotalMines] = useState(50);
    const [errors, setErrors] = useState<string[]>([]);

    const setGameParams = useSetRecoilState(gameParamsState);

    const createGame = () => {

        const newErrors: string[] = [];
        const squares = size * size;

        if (squares < totalMines)
            newErrors.push("There are more mines than squares!");

        if (size < 2)
            newErrors.push("Size is too small!");
            
        if (size > 50)
            newErrors.push("Size is too big!");

        if (newErrors.length) {
            setErrors(newErrors);
            return;
        }

        setGameParams({ size, totalMines });
    };

    const sizeText = (size > 1)
    ? `( ${size} x ${size} = ${size*size} squares. )`
    : "";

    return (
        <SafeAreaView style={styles.main}>
            <KeyboardAvoidingView
                style={styles.innerMain}
                behavior="padding"
                enabled
            >

                <View>
                    <Text style={styles.title}>
                        Minesweeper
                    </Text>
                    <Text style={styles.subtitle}>
                        by Jose Miralles
                    </Text>
                    <View style={styles.instructions}>
                        <Text style={appStyles.text}>* Press on a square to dig it up.</Text>
                        <Text style={appStyles.text}>* Press and hold on a square to flag it.</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    <View>
                        {errors.map((e, i) => (<Text style={styles.error} key={i}>{e}</Text>))}
                    </View>

                    <Text style={styles.label}>Board Size: {sizeText}</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={styles.TextInput}
                        value={size.toString()}
                        onChangeText={(e) => { setSize((e as unknown as number)) }} />

                    <Text style={styles.label}>Total Mines:</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={styles.TextInput}
                        value={totalMines.toString()}
                        onChangeText={(e) => { setTotalMines((e as unknown as number)) }}
                    />
                    <Button
                        color={styles.button.color}
                        title="play"
                        onPress={createGame}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        padding: 25,
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: BGColors.main
    },
    innerMain: {
        flex: 1,
        justifyContent: "space-evenly",
        maxHeight: 600
    },
    form: {
        flexDirection: "column",
    },
    title: {
        fontSize: 30,
        ...appStyles.text,
        textAlign: "center",
        margin: 5,
        fontWeight: "bold"
    },
    subtitle: {
        textAlign: "center",
        ...appStyles.text,
        margin: 5
    },
    instructions: {
        marginTop: 27,
        marginBottom: 27,
        backgroundColor: BGColors.third,
        padding: 20,
        borderRadius: 10
    },
    label: {
        color: FGColors.label
    },
    TextInput: {
        padding: 10,
        borderColor: FGColors.label,
        borderWidth: 1,
        marginTop: 6,
        marginBottom: 15,
        ...appStyles.text
    },
    button: {
        color: FGColors.main
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: 12
    }
});

export default NewGameForm;
