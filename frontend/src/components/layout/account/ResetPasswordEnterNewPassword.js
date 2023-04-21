import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';

import { BASE_URL } from '../../../constants';

const FormContainer = styled.div`
  width: 400px;
  margin: 20px auto;
`;

function ResetPasswordEnterNewPassword() {
  const [errors, setErrors] = useState({});
  const { uid, token } = useParams();
  const navigate  = useNavigate();
  const [formData, setFormData] = useState({
		uid: uid,
		token: token,
    new_password: '',
    re_new_password: '',
	});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({...prevState, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // send new password
      axios.post(`${BASE_URL}/auth/users/reset_password_confirm/`, formData,{
        headers: { 'Content-Type': 'application/json'}
      })
        .then(res => res.status === 204 && navigate('/users/reset_password/reset_done'))
        .catch(err => console.error(err));
    };
  };

  const validateFormData = formData => {
    const errors = {};

    if (formData.new_password.length < 10) {
      errors.new_password = 'Password must be at least 10 characters long';
    };

    if (formData.new_password !== formData.re_new_password) {
      errors.re_new_password = 'Passwords do not match';
    };

    return errors;
  };

  return (
    <FormContainer border="0">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="new_password">
          <Form.Label> Password: </Form.Label>
          <Form.Control type="password" name="new_password" onChange={handleChange}/>
          {errors.new_password && <span className="error">{errors.new_password}</span>}
        </Form.Group>
        <Form.Group controlId="re_new_password">
          <Form.Label> Confirm Password: </Form.Label>
          <Form.Control type="password" name="re_new_password" onChange={handleChange}/>
          {errors.re_new_password && <span className="error">{errors.re_new_password}</span>}
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant='secondary' type="submit" style={{marginTop: "15px"}}>Apply new password</Button>
        </div>
      </Form>
    </FormContainer>
  )
};

export default ResetPasswordEnterNewPassword;
