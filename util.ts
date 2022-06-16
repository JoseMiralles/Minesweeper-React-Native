import { Platform, Vibration } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * Vibrates based on the provided setting.
 * Attempts to do so only on ios and android.
 */
export const vibrate = (
    strength: 1 | 2 | 3
) => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
        switch (strength){
            case 1:
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
            case 2:
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
            case 3:
                Vibration.vibrate(2000);
            break;
        }
    }
}