import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

import CardAvatarImage from "../image/CardAvatarImage";

const CardContainer = styled(Card)`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 20px auto;
  padding: 10px;
  &:hover {
    border-color: white;
    -webkit-box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
    -moz-box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
    box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
  }
`;

const UserDetailsWrapper = styled.div`
  align-items: left;
  margin-left: 30px
`;

const UserDetails = styled.div`
  text-align: left;
`;

const UserName = styled(Card.Title)`
  margin-bottom: 0; 
`;

const LinkName = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: bold;
  &:hover {
    color: #0a58ca;
  }
`;

function UserCard({ user }) {
  const {id, avatar, nickname, name, surname, followers } = user;
  const userName = name || surname ? `${name} ${surname}` : nickname;
  const slug = nickname;

  return (
    <CardContainer>
      <CardAvatarImage src={avatar} />
      <UserDetailsWrapper>
        <UserDetails>
          <LinkName to={`/users/${id}/${slug}`}>
            <UserName>{userName}</UserName>
          </LinkName>
          <Card.Text>Followers: {followers}</Card.Text>
        </UserDetails>
      </UserDetailsWrapper>
    </CardContainer>
  )
};

export default UserCard;
