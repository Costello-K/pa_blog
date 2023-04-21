import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		userId: null,
	},
	reducers: {
		setUserId(state, action) {
			state.userId = action.payload.id
		},
		removeUserId(state, action) {
			state.userId = null
		},
	},
});

export const {
	setUserId,
	removeUserId,
} = authSlice.actions;

export default authSlice.reducer;
