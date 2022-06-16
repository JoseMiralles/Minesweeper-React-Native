import { TextStyle, TouchableOpacity, ViewStyle, StyleSheet, Text } from "react-native";
import { ISquare } from "../game/Board";
import { BGColors, FGColors } from "./styles";

interface IParams {
    square: ISquare
    isGameLost: boolean;
    onPress: (() => void) | undefined;
    onLongPress: (() => void) | undefined;
}

const Square = (
    { square, isGameLost, onPress, onLongPress }: IParams
) => {

    const {text, styleKey, textStyleKey}
        = getTextAndStyle(square, isGameLost);

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            style={ squareStyles[styleKey]} >
            <Text style={ squareTextStyles[textStyleKey] }>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default Square;

/**
 * Returns the correct text, and styling for each square.
 * TODO: Replace this with memoization.
 */
const getTextAndStyle =(
    square: ISquare, isGameLost: boolean
): {
    text: string;
    styleKey: keyof typeof squareStyles;
    textStyleKey: keyof typeof squareTextStyles
} => {

    /**
     * All the mines need to be shown if the game is lost.
     */
    if (square.mine && isGameLost)
        return {
            text: "*",
            styleKey: "mine",
            textStyleKey: "mine"
        }

    /**
     * Show revealed square. Do not show number for "0" squares.
     */
    if (square.status === "REVEALED")
        return {
            text: square.number !== 0 ? square.number.toString() : "",
            styleKey: "revealed",
            textStyleKey: "revealed"
        }
    
    /**
     * Flagged squares
     */
    if (square.flagged && square.status === "DEFAULT")
        return {
            text: "F",
            styleKey: "flagged",
            textStyleKey: "flagged"
        };

    /**
     * Default squares (not revealed, or flagged)
     */
    return {
        text: "",
        styleKey: "square",
        textStyleKey: "default"
    };
};

const defaultSquare: ViewStyle | TextStyle = {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    backgroundColor: BGColors.secondary,
};

const squareStyles = StyleSheet.create({
    square: defaultSquare,
    revealed: {
        ...defaultSquare,
        backgroundColor: BGColors.third
    },
    mine: {
        ...defaultSquare,
        backgroundColor: FGColors.main,
    },
    flagged: {
        ...defaultSquare,
    }
});


const squareTextStyles = StyleSheet.create({
    mine: {
        fontWeight: "bold",
        fontSize: 30,
        lineHeight: 45,
        color: BGColors.third
    },
    revealed: {
        color: FGColors.main
    },
    flagged: {
        color: FGColors.main,
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: 20
    },
    default: {}
});
