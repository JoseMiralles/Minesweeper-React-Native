
import { StyleSheet } from "react-native";

export const BGColors = {
    main: "#1A374D",
    secondary: "#406882",
    third: "#6998AB" 
} as const;

export const FGColors = {
    main: "#B1D0E0",
    secondary: "silver",
    text: "white",
} as const;

export const numberColors = [
    ""
];

export const appStyles = StyleSheet.create({
    text: {
        color: FGColors.text
    }
});
