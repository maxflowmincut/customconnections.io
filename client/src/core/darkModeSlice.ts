import { createSlice } from '@reduxjs/toolkit';

interface DarkModeState {
    isDarkMode: boolean;
}

const initialState: DarkModeState = {
    isDarkMode: false,
};

export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
    },
});

export const { toggleDarkMode } = darkModeSlice.actions;

export const selectIsDarkMode = (state: any) => state.darkMode.isDarkMode;

export default darkModeSlice.reducer;