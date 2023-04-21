import React, { useState, useCallback } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import axios from 'axios';

import { BASE_URL } from '../../../constants';

const FormContainer = styled.div`
  width: 400px;
  margin: 20px auto;
`;

const Star = styled(FaStar)`
  color: red; 
  height: 6px; 
  vertical-align: top;
  margin-top: 5px;
`;

function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    nickname: '',
    name: '',
    surname: '',
    date_of_birth: '',
    avatar: null,
    password: '',
    re_password: '',
  });
  const [serverError, setServerError] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = useCallback(e => {
    const { name, value, type } = e.target;
    const newValue = type === 'file' ? e.target.files[0] : value;
    setFormData(prevState => ({ ...prevState, [name]: newValue }));
  }, []);

  const handleSubmit = useCallback(e => {
      e.preventDefault();

      const newErrors = validateFormData(formData);
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setServerError({});
        const registerFormData = new FormData();
        registerFormData.append('email', formData.email);
        registerFormData.append('password', formData.password);
        registerFormData.append('re_password', formData.re_password);
        registerFormData.append('profile.nickname', formData.nickname);
        registerFormData.append('profile.name', formData.name);
        registerFormData.append('profile.surname', formData.surname);
        if (formData.phone !== '') {
          registerFormData.append('phone', formData.phone);
        };
        if (formData.date_of_birth !== '') {
          registerFormData.append('profile.date_of_birth', formData.date_of_birth);
        };
        if (formData.avatar !== null) {
          registerFormData.append('profile.avatar', formData.avatar);
        };

        // create new user
        axios.post(`${BASE_URL}/auth/users/`, registerFormData, {
          headers: {'Content-Type': 'multipart/form-data'}
        })
          .then(res => navigate('/users/activate'))
          .catch(err => {
            const err_data = err.response.data;
            if (err_data.email) {
              setServerError(prevState => ({...prevState, email: err_data.email[0]}))
            };
            if (err_data.phone) {
              setServerError(prevState => ({...prevState, phone: err_data.phone[0]}))
            };
            if (err_data.profile.nickname) {
              setServerError(prevState => ({...prevState, nickname: err_data.profile.nickname[0]}))
            };
            console.error(err);
          });
      }
  },[formData, navigate]);

  const validateFormData = formData => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    };

    if (formData.phone && !/^\+380\d{9}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number format +380XXXXXXXXX';
    };

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 10) {
      errors.password = 'Password must be at least 10 characters long';
    };

    if (formData.password !== formData.re_password) {
      errors.re_password = 'Passwords do not match';
    };

    return errors;
  };

  return (
    <FormContainer border="0">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email <Star /></Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange}/>
          {errors.email && <span className="error">{errors.email}</span>}
          {serverError.email && <span className="error">{serverError.email}</span>}
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange}/>
          {errors.phone && <span className="error">{errors.phone}</span>}
          {serverError.phone && <span className="error">{serverError.phone}</span>}
        </Form.Group>
        <Form.Group controlId="nickname">
          <Form.Label>Nickname</Form.Label>
          <Form.Control type="text" name="nickname" value={formData.nickname} onChange={handleChange}/>
          {serverError.nickname && <span className="error">{serverError.nickname}</span>}
        </Form.Group>
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" name="surname" value={formData.surname} onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="dateOfBirth">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="avatar">
          <Form.Label>Avatar</Form.Label>
          <Form.Control type="file" name="avatar" accept="image/*" onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label> Password <Star /></Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange}/>
          {errors.password && <span className="error">{errors.password}</span>}
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label> Confirm Password <Star /></Form.Label>
          <Form.Control type="password" name="re_password" value={formData.re_password} onChange={handleChange}/>
          {errors.re_password && <span className="error">{errors.re_password}</span>}
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant='secondary' type="submit" style={{ marginTop: "15px" }}>Register</Button>
        </div>
      </Form>
    </FormContainer>
  )
};

export default RegistrationForm;
