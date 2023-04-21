import { createSlice } from "@reduxjs/toolkit";

const postCommentSlice = createSlice({
	name: 'postComments',
	initialState: {
		postId: null,
		currentPage: 1,
		totalPages: 1,
		comments: [],
	},
	reducers: {
		setPostId(state, action) {
			state.postId = action.payload
		},
		setComments(state, action) {
			state.comments = action.payload
		},
		setCurrentPage(state, action) {
			state.currentPage = action.payload
		},
		setTotalPages(state, action) {
			state.totalPages = action.payload
		},
		addComments(state, action) {
			state.comments = [...state.comments, ...action.payload]
		},
		removeComments(state, action) {
			state.postId = null;
			state.currentPage = 1;
			state.totalPages = 1;
			state.comments = [];
		},
	},
});

export const {
	setPostId,
	setComments,
	setCurrentPage,
	setTotalPages,
	addComments,
	removeComments,
} = postCommentSlice.actions;

export default postCommentSlice.reducer;
