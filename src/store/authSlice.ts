// this is for redux store configuration which i can add slices to later
// slices is for different parts of the state that can be managed separately
// example: authSlice for authentication, postSlice for blog posts, etc.

import { configureStore, createSlice } from '@reduxjs/toolkit';

// Dummy slice for now
const dummySlice = createSlice({
  name: 'dummy',
  initialState: {},
  reducers: {},
});

export const store = configureStore({
  reducer: {
    dummy: dummySlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
