import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import styled from 'styled-components';

import { BASE_URL } from '../../../constants';
import CardAvatarImage from '../image/CardAvatarImage';

const CardContainer = styled(Card)`
  width: 100%;
  margin: 20px auto;
  display: flex;
  flex-direction: row;
  padding: 10px;
  &:hover {
    border-color: white;
    -webkit-box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
    -moz-box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
    box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 30px;
`;

const UserName = styled(Card.Title)`
  margin-bottom: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonEl = styled(Button)`
  border: 1px solid grey;
`;

const LinkName = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: bold;
  &:hover {
    color: #0a58ca;
  }
`;

function SubscriberCard({ user }) {
  const { id, avatar, nickname, name, surname, followers } = user;
  const userName = name || surname ? `${name} ${surname}` : nickname;
  const slug = nickname;
  const [subscribe, setSubscribe] = useState(true);

  const changeSubscribe = id => {
    axios.put(`${BASE_URL}/v1/followers/${id}/`)
      .then(res => setSubscribe(false))
      .catch(err => console.log(err));
  };

  return (
    <>
      {subscribe &&
        <CardContainer>
          <CardAvatarImage src={avatar} />
          <UserDetails>
            <div style={{textAlign: 'left'}}>
              <LinkName to={`/users/${id}/${slug}/`}>
                <UserName>{userName}</UserName>
              </LinkName>
              <Card.Text>Followers: {followers}</Card.Text>
            </div>
            <ButtonContainer>
              <ButtonEl variant='light' onClick={() => changeSubscribe(id)}>{'Unsubscribe'}</ButtonEl>
            </ButtonContainer>
          </UserDetails>
        </CardContainer>
      }
    </>
  )
};

export default SubscriberCard;
