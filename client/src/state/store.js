import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './slicer.js';

const store = configureStore({
    reducer: {
        images: imageReducer,
    },
});

export default store;
