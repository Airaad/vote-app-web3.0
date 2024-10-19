import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,  // Store the user data here
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;  // Set user data
    },
    logout: (state) => {
      state.userData = null;  // Reset the user data when logging out
    },
    updateIsVoted: (state, action) => {
      if (state.userData) {
        state.userData.isVoted = action.payload;  // Update isVoted field
      }
    },
  },
});

export const { setUser, logout, updateIsVoted } = userSlice.actions;

export default userSlice.reducer;
