
import { StyleSheet } from "react-native";

export const BGColors = {
    main: "#1E2019",
    secondary: "#2B2E24",
    third: "#35392D" 
} as const;

export const FGColors = {
    main: "#ADE25D",
    textSecondary: "#C2DFE3",
    text: "#C2DFE3",
    warning: "red"
} as const;

export const numberColors = [
    ""
];

export const appStyles = StyleSheet.create({
    text: {
        color: FGColors.text
    }
});
