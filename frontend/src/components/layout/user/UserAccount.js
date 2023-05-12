import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import axios from "axios";
import { Button, Card } from 'react-bootstrap';
import styled from 'styled-components';

import { BASE_URL } from "../../../constants";
import Avatar from "../image/Avatar";
import UserPostList from "../post/UserPostList";

const UserContainer = styled(Card.Body)`
  width: 100%;
  padding-bottom: 40px;
  margin-bottom: 40px;
  border-bottom: 2px solid black;
  display: flex;
`;

const UserDetails = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 30px;
`;

const UserName = styled(Card.Title)`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  text-align: right;
`;

const ButtonEl = styled(Button)`
  border: 1px solid grey;
  ${props => props.status
  ? 'border-color: gray;'
  : 'border-color: #146c43;'
}
`;

function UserAccount() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const { avatar, nickname, name, surname, followers, subscriptions, subscribe, date_of_birth } = user;
  const userName = name || surname ? `${name} ${surname}` : nickname;
  const age = new Date().getFullYear() - new Date(date_of_birth).getFullYear();

  const changeSubscribe = id => {
    // send a request to subscribe or unsubscribe from a user
    axios.put(`${BASE_URL}/v1/followers/${id}/`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    // get user data
    axios.get(`${BASE_URL}/v1/users/${id}/`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, [id]);

  return (
    <>
      <UserContainer>
        <Avatar src={avatar} />
        <UserDetails>
          <div>
            <UserName>{userName}</UserName>
            {date_of_birth && <Card.Text>Age: {age}</Card.Text>}
            <Card.Text>Followers: {followers}</Card.Text>
            <Card.Text>Subscriptions: {subscriptions}</Card.Text>
          </div>
          {subscribe !== null &&
            <ButtonContainer>
              <ButtonEl variant='light' status={subscribe} onClick={() => changeSubscribe(id)}>{subscribe ? 'Unsubscribe' : 'Subscribe'}</ButtonEl>
            </ButtonContainer>
          }
        </UserDetails>
      </UserContainer>
      <UserPostList id={id} />
    </>
  )
};

export default UserAccount;
