import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

import { BASE_URL } from '../../../constants';

const FormContainer = styled.div`
  width: 400px;
  margin: 20px auto;
`;

function ResetPasswordEnterEmail() {
  const [serverError, setServerError] = useState('');
  const [formData, setFormData] = useState({ username: '' });
  const [errors, setErrors] = useState({});
  const navigate  = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({...prevState, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    setServerError('');
    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // send password reset request
      axios.post(`${BASE_URL}/auth/users/reset_password/`, formData,{
        headers: { 'Content-Type': 'application/json'}
      })
        .then(res => res.status === 204 && navigate('/users/reset_password/email_sent'))
        .catch(err => {
          setServerError(err.response.data[0]);
          console.error(err);
        });
    };
  };

  const validateFormData = formData => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    };

    return errors;
  };

  return (
    <FormContainer border="0">
      <Form onSubmit={handleSubmit}>
        <span className="error">{serverError}</span>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange}/>
          {errors.email && <span className="error">{errors.email}</span>}
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant='secondary' type="submit" style={{marginTop: "15px"}}>Reset password</Button>
        </div>
      </Form>
    </FormContainer>
  )
};

export default ResetPasswordEnterEmail;
