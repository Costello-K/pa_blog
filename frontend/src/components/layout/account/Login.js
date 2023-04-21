import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';

import { removeUserId, setUserId } from '../../../store/authSlice';
import { BASE_URL } from '../../../constants';

const FormContainer = styled.div`
  width: 400px;
  margin: 20px auto;
`;

function LoginForm() {
  const [serverError, setServerError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate  = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(removeUserId());
  }, []);

  const handleChange = e => {
    const { name, value, type } = e.target;
    const newValue = type === 'file' ? e.target.files[0] : value;
    setFormData(prevState => ({...prevState, [name]: newValue}));
  };

  const handleSubmit = e => {
    e.preventDefault();

    setServerError('')
    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // send login information and receive tokens
      axios.post(`${BASE_URL}/auth/jwt/create/`, formData,
        {
          headers: { 'Content-Type': 'application/json'},
          withCredentials: true,
        })
        .then(res => {
          // save access token in localStorage
          localStorage.setItem('access_token', res.data.access);

          // get id of the authorized user
          axios.get(`${BASE_URL}/auth/users/me`)
            .then(res => dispatch(setUserId({id: res.data.id})))
            .catch(err => console.error(err))

          // redirect to authorized user page
          navigate('/users/me');
        })
        .catch(err => {
          setServerError(err.response.data.detail);
          console.error(err);
        });
    }
  };

  const validateFormData = formData => {
    const errors = {};

    if (!formData.username) {
      errors.username = 'Email or phone is required';
    };

    if (!formData.password) {
      errors.password = 'Password is required';
    };

    return errors;
  };

  return (
    <FormContainer border="0">
      <Form onSubmit={handleSubmit}>
        <span className="error">{serverError}</span>
        <Form.Group controlId="login">
          <Form.Label>Email or Phone</Form.Label>
          <Form.Control type="login" name="username" value={formData.username} onChange={handleChange}/>
          {errors.username && <span className="error">{errors.username}</span>}
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label> Password: </Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange}/>
          {errors.password && <span className="error">{errors.password}</span>}
        </Form.Group>
        <Button variant='secondary' type="submit" style={{marginTop: "15px"}}>Login</Button>
        <div style={{marginTop: '5px'}}>
          <Link to='/users/reset_password/email'>Forgot your password?</Link>
        </div>
      </Form>
    </FormContainer>
  )
};

export default LoginForm;
