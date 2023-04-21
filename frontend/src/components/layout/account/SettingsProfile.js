import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from '../../../constants';
import Avatar from '../image/Avatar';
import { removeUserId } from '../../../store/authSlice';
import {retry} from "@reduxjs/toolkit/query";

const UserCard = styled.div`
  width: 100%;
  margin: 20px auto;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserPropertyWrapper = styled.div`
  margin-top: 20px;
  border-bottom: 1px solid black;
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
`;

const UserProperty = styled.div`
  display: flex;
  flex-direction: row;
`;

const Property = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  margin-left: 20px;
  padding-bottom: 10px;
  align-items: center;
`;

const LightButton = styled(Button)`
  margin-right: 15px;
  border: 1px solid grey;
`

function SettingsProfile() {
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [successChangePassword, setSuccessChangePassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // get authorized user details
    axios.get(`${BASE_URL}/v1/users/me/`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  const { avatar, nickname, name, surname, email, phone, date_of_birth } = user;

  const validateFormData = formData => {
    const errors = {};

    if (editingField === "email") {
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
    };

    if (editingField === "phone" && !(formData.phone === '' || /^\+380\d{9}$/.test(formData.phone))) {
      errors.phone = 'Invalid phone number format. +380XXXXXXXXX';
    };

    if (editingField === "delete_account" && !formData.current_password) {
        errors.current_password = 'Password is required';
    };

    if (editingField === "change_password") {
      if (!formData.current_password) {
        errors.current_password = 'Password is required';
      };

      if (formData.new_password.length < 10) {
        errors.new_password = 'Password must be at least 10 characters long';
      };

      if (formData.new_password !== formData.re_new_password) {
        errors.re_new_password = 'Passwords do not match';
      };
    };

    return errors;
  };

  const onCancel = () => {
    setEditingField(null);
    setServerError('');
    setErrors({});
  };

  const openForm = field => {
    field === editingField
      ? onCancel()
      : setEditingField(field)
  };

  const phoneHandleSubmit = e => {
    e.preventDefault();
    setServerError('');

    const newFormData = formData.phone ? formData : {phone: ''}

    const newErrors = validateFormData(newFormData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && Object.keys(newFormData).length > 0) {
      // change phone
      axios.put(`${BASE_URL}/v1/users/me/`, newFormData)
        .then(res => {
          setUser(res.data)
          setFormData({})
          openForm();
        })
        .catch(err => err.response.data.phone && setServerError(err.response.data.phone[0]))
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setServerError('');

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && Object.keys(formData).length > 0) {
      // change authorized user settings
      axios.put(`${BASE_URL}/v1/users/me/`, formData)
        .then(res => {
          setUser(res.data)
          setFormData({})
          openForm();
        })
        .catch(err => {
          err.response.data.email && setServerError(err.response.data.email[0])
          err.response.data.nickname && setServerError(err.response.data.nickname[0])
        })
    }
  };

  const handleSubmitAvatar = e => {
    e.preventDefault();

    if (file) {
      const fileFormData = new FormData();
      fileFormData.append('avatar', file);

      // change avatar
      axios.put(`${BASE_URL}/v1/users/me/avatar/`, fileFormData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
        .then(res => {
          setUser(res.data)
          setFile(null)
          openForm();
        })
        .catch(err => console.log(err));
    }
  };

  const handleSubmitDeleteAccount = e => {
    e.preventDefault();

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // delete account
      axios.delete(`${BASE_URL}/auth/users/me/`, {data: {current_password: formData.current_password}})
        .then(res => {
          // we will not delete refresh token from cookies, it will no longer be valid

          // remove access token token from localStorage
          localStorage.removeItem('access_token');
          dispatch(removeUserId());

          // redirect user to a confirmation page that the account was successfully deleted
          navigate('/users/delete');
        })
        .catch(err => {
          if (err.response.data.current_password) {
            setErrors({current_password: err.response.data.current_password[0]})
          }
        });
    }
  }

  const handleSubmitChangePassword = e => {
    e.preventDefault();

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // change password
      axios.post(`${BASE_URL}/auth/users/set_password/`, formData)
        .then(res => {
          setSuccessChangePassword(true);
          openForm();
          setTimeout(() => {
            setSuccessChangePassword(false);
          }, 2000);
        })
        .catch(err => {
          if (err.response.data.current_password) {
            setErrors({current_password: err.response.data.current_password[0]})
          };
        });
    };
  };

  const deleteAvatar = () => {
    // delete avatar
    axios.delete(`${BASE_URL}/v1/users/me/avatar/`, {})
      .then(res => {
        if (res.data && Object.keys(res.data).length > 0) {
          setUser(res.data)
        };
      })
      .catch(err => console.log(err))
      .finally(() => openForm());
  }

  const formButtonGroups = () => {
    return (
      <div className="d-flex justify-content-end">
        <LightButton variant='light' type='cancel' onClick={onCancel}>Cancel</LightButton>
        <Button variant='secondary' type='submit'>Apply</Button>
      </div>
    )
  }

  const formChangeProperty = (value, name, type) => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId={name} style={{marginBottom: '15px'}}>
          {type !== 'date' && <Form.Control type={type} defaultValue={value} onChange={e => setFormData({ [name]: e.target.value })} />}
          {type === 'date' && <Form.Control type={type} defaultValue={value}
                                            onChange={e => setFormData({[name]: e.target.value ? e.target.value : null})}/>}
          {errors[name] && <span className="error">{errors[name]}</span>}
          {<span className="error">{serverError}</span>}
        </Form.Group>
        {formButtonGroups()}
      </Form>
    )
  };

  const formChangePassword = (label, name) => {
    return (
      <Form.Group controlId={name} style={{marginBottom: '10px'}}>
        <Form.Label>{label}</Form.Label>
        <Form.Control type='password' onChange={e => setFormData(prevState => ({...prevState, [name]: e.target.value }))} />
        {errors[name] && <span className='error'>{errors[name]}</span>}
      </Form.Group>
    )
  }

  const renderEditForm = () => {
    switch(editingField) {
      case 'avatar':
        return (
          <Form onSubmit={handleSubmitAvatar} style={{marginTop: '15px'}}>
            <Form.Group controlId='avatar' style={{marginBottom: '15px'}}>
              <Form.Control type='file' onChange={e => setFile(e.target.files[0])} />
            </Form.Group>
            {formButtonGroups()}
          </Form>
        );
      case 'nickname':
        return formChangeProperty(nickname, 'nickname', 'text')
      case 'name':
        return formChangeProperty(name, 'name', 'text')
      case 'surname':
        return formChangeProperty(surname, 'surname', 'text')
      case 'email':
        return formChangeProperty('', 'email', 'email')
      case 'phone':
        return (
          <Form onSubmit={phoneHandleSubmit}>
            <Form.Group controlId='phone' style={{marginBottom: '15px'}}>
              <Form.Control type='tel' placeholder='+380XXXXXXXXX' onChange={e => setFormData({ phone: e.target.value })} />
              {errors.phone && <span className="error">{errors.phone}</span>}
              {<span className="error">{serverError}</span>}
            </Form.Group>
            {formButtonGroups()}
          </Form>
        );
      case 'date of birth':
        return formChangeProperty(date_of_birth, 'date_of_birth', 'date')
      case 'delete_account':
        return (
          <Form onSubmit={handleSubmitDeleteAccount} style={{paddingTop: '10px'}}>
            {formChangePassword('Enter password', 'current_password')}
            {formButtonGroups()}
          </Form>
        );
      case 'change_password':
        return (
          <Form onSubmit={handleSubmitChangePassword} style={{paddingTop: '10px'}}>
            {formChangePassword('Current password', 'current_password')}
            {formChangePassword('New password', 'new_password')}
            {formChangePassword('Confirm new password', 're_new_password')}
            {formButtonGroups()}
          </Form>
        );
      default:
        return null;
    }
  };

  const property = (value, name) => {
    return (
      <UserPropertyWrapper>
        <UserProperty>
          <strong>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}:</strong>
          <Property>
            {value || '-'}
            <FaEdit onClick={() => openForm(name)}/>
          </Property>
        </UserProperty>
        {editingField === name && renderEditForm()}
      </UserPropertyWrapper>
    )
  };

  return (
    <UserCard>
        <UserDetails>
          <h1 style={{textAlign: "center"}}>Settings</h1>
          <UserPropertyWrapper>
            <UserProperty>
              <Avatar src={avatar} />
              <Property>
                <FaTrash style={{marginLeft: "30px"}} onClick={() => deleteAvatar()}/>
                <FaEdit onClick={() => openForm("avatar")}/>
              </Property>
            </UserProperty>
            {editingField === "avatar" && renderEditForm()}
          </UserPropertyWrapper>
          {property(nickname, 'nickname')}
          {property(name, 'name')}
          {property(surname, 'surname')}
          {property(email, 'email')}
          {property(phone, 'phone')}
          {property(date_of_birth, 'date of birth')}
          <div style={{marginTop: "20px"}}>
            <Button variant='secondary' onClick={() => openForm("delete_account")}>Delete Account</Button>
            {editingField === "delete_account" && renderEditForm()}
          </div>
          <div style={{marginTop: "20px"}}>
            <Button variant='secondary' onClick={() => openForm("change_password")}>Change password</Button>
            {editingField === "change_password" && renderEditForm()}
            {successChangePassword && <p>The password has been changed</p>}
          </div>
        </UserDetails>
    </UserCard>
  )
};

export default SettingsProfile;
