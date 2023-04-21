import { createSlice } from "@reduxjs/toolkit";

const myPostsSlice = createSlice({
	name: 'myPosts',
	initialState: {
		posts: [],
		status: '',
		countPages: 0,
		countPosts: 0,
		currentPage: 1,
	},
	reducers: {
		setMyPosts(state, action) {
			state.posts = action.payload
		},
		setMyPostsStatus(state, action) {
			state.status = action.payload
		},
		setMyPostsCountPages(state, action) {
			state.countPages = action.payload
		},
		setMyPostsCountPosts(state, action) {
			state.countPosts = action.payload
		},
		setMyPostsCurrentPage(state, action) {
			state.currentPage = action.payload
		},
		removeMyPostsStatus(state, action) {
			state.status = ''
		},
		removeMyPostsCountPages(state, action) {
			state.countPages = 0
		},
	},
});

export const {
	setMyPosts,
	setMyPostsStatus,
	setMyPostsCountPages,
	setMyPostsCurrentPage,
	removeMyPostsStatus,
	removeMyPostsCountPages,
	setMyPostsCountPosts
} = myPostsSlice.actions;

export default myPostsSlice.reducer;
