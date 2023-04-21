import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

import CardAvatarImage from "../image/CardAvatarImage";

const CardContainer = styled(Card)`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 20px auto;
  padding: 10px;
  &:hover {
    border-color: white;
    -webkit-box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
    -moz-box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
    box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
  }
`;

const UserDetails = styled.div`
  margin-left: 30px;
  text-align: left;
  @media screen and (max-width: 767px) {
    margin-left: 15px;
  }
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

function FollowerCard({ user }) {
  const {id, avatar, nickname, name, surname, followers } = user;
  const userName = name || surname ? `${name} ${surname}` : nickname;
  const slug = nickname;

  return (
    <CardContainer>
      <CardAvatarImage src={avatar} />
      <UserDetails>
        <LinkName to={`/users/${id}/${slug}`}>
          <UserName>{userName}</UserName>
        </LinkName>
        <Card.Text>Followers: {followers}</Card.Text>
      </UserDetails>
    </CardContainer>
  );
}

export default FollowerCard;
