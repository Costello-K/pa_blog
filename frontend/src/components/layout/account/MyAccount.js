import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLevelDownAlt } from 'react-icons/fa';

import { BASE_URL } from '../../../constants';
import Avatar from '../image/Avatar';
import NewPost from '../post/NewPost';
import MyPostList from '../post/MyPostList';

const AccountContainer = styled(Card.Body)`
  padding-bottom: 40px;
  margin-bottom: 40px;
  border-bottom: 2px solid black;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: left;
  @media screen and (max-width: 767px) {
    margin-left: 15px;
  }
`;

const UserName = styled(Card.Title)`
  margin-bottom: 20px;
`;

const LinkWrapper = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: 500;
`;

function MyAccount() {
  const [user, setUser] = React.useState({});

  // get authorized user details
  useEffect(() => {
    axios.get(`${BASE_URL}/v1/users/me/`)
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  const { avatar, nickname, name, surname, followers, subscribers } = user;
  const userName = name || surname ? `${name} ${surname}` : nickname;

  return (
    <div>
      <AccountContainer>
        <UserDetails>
          <Avatar src={avatar} />
          <div style={{marginLeft: '30px'}}>
            <UserName>{userName}</UserName>
            <Card.Text>Followers: {followers}{followers > 0 && <LinkWrapper to='/followers/'> <FaLevelDownAlt /></LinkWrapper>}</Card.Text>
            <Card.Text>Subscribers: {subscribers}{subscribers > 0 && <LinkWrapper to='/subscribers/'> <FaLevelDownAlt /></LinkWrapper>}</Card.Text>
          </div>
        </UserDetails>
      </AccountContainer>
      <NewPost />
      <MyPostList />
    </div>
  )
};

export default MyAccount;
