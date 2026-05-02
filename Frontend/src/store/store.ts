/* Archivo: Frontend\src\store\store.ts
   Proposito: Implementa la logica principal del archivo store.
*/
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // <-- FALTA ESTO

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;