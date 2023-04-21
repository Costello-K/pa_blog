import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';

import { BASE_URL } from '../../../constants';
import { setComments } from '../../../store/postCommentSlice';

const ContainerForm = styled(Form)`
  width: 100%;
  padding: 10px; 
  background: #f5f5f5;
`;

function CommentForm() {
	const postId = useSelector(state => state.postComments.postId);
	const comments = useSelector(state => state.postComments.comments);
	const currentPage = useSelector(state => state.postComments.currentPage);
	const totalPages = useSelector(state => state.postComments.totalPages);
	const [formData, setFormData] = useState({
    post: postId,
    text: '',
  });
	const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();

		if (formData.text !== '') {
			// create new comment
			axios.post(`${BASE_URL}/v1/reviews/create/`, formData)
				.then(res => {
					if (totalPages < currentPage) {
						dispatch(setComments([...comments, res.data]))
					}
				})
				.catch(err => console.error(err))
				.finally(() => setFormData(prevFormData => ({...prevFormData, text: ''})))
		}
  };

	return (
		<ContainerForm onSubmit={handleSubmit}>
			<Form.Group controlId="text">
				<Form.Label>Comment</Form.Label>
				<Form.Control as="textarea" rows={5} placeholder="Enter your comment" value={formData.text}
											onChange={event => setFormData(prevFormData => ({...prevFormData, text: event.target.value }))} />
			</Form.Group>
			<div style={{display: "flex", justifyContent: "flex-end"}}>
				<Button variant="secondary" type="submit" style={{marginTop: "10px", marginLeft: "10px"}}>Submit</Button>
			</div>
		</ContainerForm>
	)
};

export default CommentForm;
