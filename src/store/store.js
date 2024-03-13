import { configureStore } from "@reduxjs/toolkit";
import timelineSlice from "./timelineSlice";

export const store = configureStore({
    reducer: timelineSlice
})