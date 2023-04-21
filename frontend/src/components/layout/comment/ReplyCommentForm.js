import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import { BASE_URL } from '../../../constants';
import { setComments } from '../../../store/postCommentSlice';

function ReplyCommentForm({ commentId, closeForm }) {
	const postId = useSelector(state => state.postComments.postId);
	const page_size = useSelector(state => state.postComments.comments.length);
  const [formData, setFormData] = useState({
    parent: commentId,
    post: postId,
    text: '',
  });
	const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();

		if (formData.text !== '') {
			// create reply to a comment
			axios.post(`${BASE_URL}/v1/reviews/create/`, formData)
				.then(res => {
					// if comment has been created - update the list of comments
					axios.get(`${BASE_URL}/v1/posts/reviews/${postId}/?page_size=${page_size}`)
						.then(res => dispatch(setComments(res.data.results)))
						.catch(err => console.error(err))
						.finally(() => closeForm());
				})
				.catch(error => console.error(error));
		}
  };

  return (
		<Form onSubmit={handleSubmit}>
			<Form.Group controlId="text">
				<Form.Control as="textarea" rows={3} placeholder="Enter your reply" value={formData.text}
											onChange={event => setFormData(prevFormData => ({...prevFormData, text: event.target.value}))}/>
			</Form.Group>
			<div className="d-flex justify-content-end align-items-center" style={{padding: '15px 0'}}>
				<Button variant="light" type="cancel" onClick={closeForm} style={{marginRight: '10px', border: '1px solid grey'}}>Cancel</Button>
				<Button variant="secondary" type="submit">Submit</Button>
			</div>
		</Form>
  )
};

export default ReplyCommentForm;
