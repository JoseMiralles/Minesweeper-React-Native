import React, { useState } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { BGColors, FGColors } from "./styles";

interface ISelection<T> {
    text: string;
    value: T;
}

interface IParams<T> {
    selections: ISelection<T>[];
    onSelection: (selection: ISelection<T>) => void;
    style?: StyleProp<ViewStyle>
}

function RadioSet<T> (
    {selections, onSelection, style}: IParams<T>
) {

    const [selected, setSelected] = useState(0);

    const onPress = (s: ISelection<T>, i: number) => {
        setSelected(i);
        onSelection(s);
    };

    const options = selections.map((s,i) => {
        return (
            <TouchableOpacity
                key={i}
                style={[
                    styles.selection,
                    (i === selected) && styles.selected
                ]}
                onPress={()=>{onPress(s, i)}}>
                    <Text style={styles.text}>{s.text}</Text>
            </TouchableOpacity>
        );
    });

    return (
        <View style={[styles.main, style]}>
            {options}
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        height: 45,
        flexDirection: "row",
        justifyContent: "center",
    },
    selection: {
        alignSelf: "baseline",
        padding: 12,
        paddingHorizontal: 26,
        borderRadius: 80
    },
    selected: {
        backgroundColor: BGColors.secondary
    },
    text: {
        color: FGColors.text
    },
});

export default RadioSet;
