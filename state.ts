import { atom } from "recoil";
import Game from "./game/Game";

export const gameParamsState = atom<
    {size: number; totalMines: number}
>({
    key: "gameParamsState",
    default: undefined
});
