import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import styled from 'styled-components';

import { BASE_URL } from '../../../constants';
import UserCard from './UserCard';

const UserListContainer = styled.div`
  margin: 50px auto;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  & .page-item .page-link{
    border-color: #6c757d;
    color: #6c757d;
  }
  & .page-item.active .page-link{
    background-color: #6c757d;
    border-color: #6c757d;
    color: #fff;
  }
`;

function UserList() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount ] = useState(0);
  const [totalProfiles, setTotalProfiles ] = useState(0);
  const [usersNotFound, setUsersNotFound] = useState(false);

  useEffect(() => {
    setUsersNotFound(false);

    // get list of users by search parameters
    axios.get(`${BASE_URL}/v1/users/?page=${page}&search=${searchUser}`)
      .then(res => {
        setUsers(res.data.results);
        setPagesCount(res.data.total_pages);
        setTotalProfiles(res.data.count);

        if (res.data.results.length === 0) {
          setUsersNotFound(true)
        };

      })
      .catch(err => console.log(err));
  }, [page, searchUser]);

  const handleChangeSearch = e => {
    setSearchUser(e.target.value);
    setPage(1);
  };

  const handlePageChange = pageNumber => setPage(pageNumber);

  return (
    <>
      <h3 style={{textAlign: "center"}}>All users</h3>
      <form>
        <input className="form-control" type="search" placeholder="Search user" aria-label="Search" onChange={handleChangeSearch}></input>
      </form>
      <div>
        {usersNotFound
          ? <p>Users not found</p>
          : <p>Find {totalProfiles} {totalProfiles === 1 ? 'user' : 'users'}</p>
        }
      </div>
      <UserListContainer>
          {users?.map((user, id) => <UserCard key={id} user={user}/>)}
      </UserListContainer>
      {pagesCount > 1 &&
        <PaginationContainer>
          <Pagination>
            {Array.from({ length: pagesCount }, (_, index) => (
              <Pagination.Item key={index + 1} active={page === index + 1} onClick={() => handlePageChange(++index)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </PaginationContainer>
      }
    </>
  )
};

export default UserList;
