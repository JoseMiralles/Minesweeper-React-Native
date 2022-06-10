import { atom } from "recoil";
import Game from "./game/Game";

export const gameState = atom<Game>({
    key: "gameState",
    default: undefined
});