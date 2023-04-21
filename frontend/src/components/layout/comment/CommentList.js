import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import Comment from './Comment';
import { BASE_URL } from '../../../constants';
import CommentForm from './CommentForm';
import { addComments, setComments, setCurrentPage, setTotalPages, removeComments } from '../../../store/postCommentSlice';

function CommentList() {
	const postId = useSelector(state => state.postComments.postId);
	const comments = useSelector(state => state.postComments.comments);
	const currentPage = useSelector(state => state.postComments.currentPage);
	const totalPages = useSelector(state => state.postComments.totalPages);
	const dispatch = useDispatch();

	const [fetching, setFetching] = useState(true);

	useEffect(() => {
		if (fetching && totalPages >= currentPage) {
			// get list of comments, load more comments when scrolling
			axios.get(`${BASE_URL}/v1/posts/reviews/${postId}/?page=${currentPage}`)
				.then(res => {
					currentPage === 1
						? dispatch(setComments(res.data.results))
						: dispatch(addComments(res.data.results))
					dispatch(setCurrentPage(currentPage + 1));
					dispatch(setTotalPages(res.data.total_pages));
				})
				.catch(err => console.error(err))
				.finally(() => setFetching(false));
		};
	}, [postId, fetching]);

	useEffect(() => {
		return () => dispatch(removeComments());
	}, []);

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);
		window.addEventListener('beforeunload', () => dispatch(removeComments()));

		return () => document.removeEventListener('scroll', scrollHandler);
	}, [totalPages, currentPage])

	const scrollHandler = e => {
		if (totalPages >= currentPage && e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
			setFetching(true)
		}
	};

	return (
		<>
			<CommentForm />
			{comments?.map((comment, id) => <Comment key={id} comment={comment} />)}
		</>
	)
};

export default CommentList;
