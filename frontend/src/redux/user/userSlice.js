import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,  // Store the user data here
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    logout: (state) => {
      state.userData = null; // Reset the user data when logging out
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
