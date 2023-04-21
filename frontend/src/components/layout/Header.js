import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { removeUserId } from '../../store/authSlice';
import axios from "axios";
import { BASE_URL } from "../../constants";

const MainContainerWrapper = styled.div`
  width: 100%;
  background: #f8f9fa;
`;

const MainContainer = styled.div`
  max-width: 800px;
  min-width: 480px;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    width: calc(50% - 12px);
  }
`;

const LinkWrapper = styled(Link)`
  &:active {
    background-color: gray;
  }
`;

const NavLinkWrapper = styled(Link)`
  padding: 8px;
`;

const DropdownMenuWrapper = styled.div`
  position: absolute;
  right: 0;
  zIndex: 10;
`;

function Header() {
  const auth = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();

  const logout = () => {
    // remove refresh token from cookies
    axios.delete(`${BASE_URL}/auth/jwt/cookies/`, { withCredentials: true })
      .then(res => res)
      .catch(err => console.error(err))
      .finally(() => {
        // remove access token token from localStorage
        localStorage.removeItem('access_token');
        dispatch(removeUserId());
      })
  };

  return (
    <MainContainerWrapper>
      <MainContainer>
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{width: '100%'}}>
          <div className="container-fluid">
            <a href='#' className="navbar-brand">BLOG</a>
            <div style={{display: 'flex'}}>
              <ul className="navbar-nav" style={{display: 'flex', flexDirection: 'row'}}>
                <li className="nav-item"><NavLinkWrapper className="nav-link active" aria-current="page" to="/">Home</NavLinkWrapper></li>
                <li className="nav-item"><NavLinkWrapper className="nav-link" to="/users">Users</NavLinkWrapper></li>
                <li className="nav-item"><NavLinkWrapper className="nav-link" to="/posts">Posts</NavLinkWrapper></li>
                {auth && <li className="nav-item"><NavLinkWrapper className="nav-link" to="/users/me">MyUser</NavLinkWrapper></li>}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{padding: '8px'}}>Enter</a>
                  <DropdownMenuWrapper>
                    <ul className="dropdown-menu" style={{position: 'static'}}>
                      {!auth && <li><LinkWrapper className="dropdown-item" to="/users/registration">Registration</LinkWrapper></li>}
                      {auth && <li><LinkWrapper className="dropdown-item" to="/users/settings">Settings</LinkWrapper></li>}
                      <li><hr className="dropdown-divider"></hr></li>
                      {!auth && <li><LinkWrapper className="dropdown-item" to="/users/login">Login</LinkWrapper></li>}
                      {auth && <li><LinkWrapper className="dropdown-item" onClick={logout} to="/posts">Logout</LinkWrapper></li>}
                    </ul>
                  </DropdownMenuWrapper>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </MainContainer>
    </MainContainerWrapper>
  )
};

export default Header;
