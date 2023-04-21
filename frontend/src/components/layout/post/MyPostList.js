import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { Pagination, ButtonGroup, ToggleButton } from 'react-bootstrap';
import styled from 'styled-components';

import MyPostCard from './MyPostCard';
import { BASE_URL } from '../../../constants';
import {
  setMyPosts,
  setMyPostsStatus,
  setMyPostsCountPages,
  setMyPostsCountPosts,
  setMyPostsCurrentPage
} from "../../../store/myPostsSlice";

const PostListContainer = styled.div`
  width: 100%;
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

function MyPostList() {
  const posts = useSelector(state => state.myPostList.posts);
  const status = useSelector(state => state.myPostList.status);
  const countPages = useSelector(state => state.myPostList.countPages);
  const totalPosts = useSelector(state => state.myPostList.countPosts);
  const page = useSelector(state => state.myPostList.currentPage);
  const dispatch = useDispatch();
  const [searchPost, setSearchPost] = useState('');
  const [postsNotFound, setPostsNotFound] = useState(false);

  useEffect(() => {
    dispatch(setMyPosts([]));
    setPostsNotFound(false);

    // get my list of posts by search parameters
    axios.get(`${BASE_URL}/v1/users/me/posts/?page=${page}&search=${searchPost}&status=${status}`)
      .then(res => {
        const data = res.data;
        dispatch(setMyPosts(data.results));
        dispatch(setMyPostsCountPages(data.total_pages));
        dispatch(setMyPostsCountPosts(data.count));

        if (data.results.length === 0) {
          setPostsNotFound(true)
        };

      })
      .catch(err => console.log(err));
  }, [page, searchPost, status]);

  const handleChangeSearch = e => {
    setSearchPost(e.target.value);
    dispatch(setMyPostsCurrentPage(1));
  };

  const handlePageChange = pageNumber => dispatch(setMyPostsCurrentPage(pageNumber));

  const handleFilterChange = status => {
    dispatch(setMyPostsStatus(status));
    dispatch(setMyPostsCurrentPage(1));
  };

  return (
    <>
      <ButtonGroup style={{marginTop: '15px'}}>
        <ToggleButton id="all" type="radio" variant="outline-secondary" name="radio" value=""
          checked={status === ''} onChange={e => handleFilterChange(e.currentTarget.value)}>
          All posts
        </ToggleButton>
        <ToggleButton id="draft" type="radio" variant="outline-secondary" name="radio" value="draft"
          checked={status === 'draft'} onChange={e => handleFilterChange(e.currentTarget.value)}>
          Drafts
        </ToggleButton>
        <ToggleButton id="published" type="radio" variant="outline-secondary" name="radio" value="published"
          checked={status === 'published'} onChange={e => handleFilterChange(e.currentTarget.value)}>
          Published
        </ToggleButton>
      </ButtonGroup>
      <form style={{marginTop: '15px'}}>
        <input className="form-control" type="search" placeholder="Search post" aria-label="Search" onChange={handleChangeSearch}></input>
      </form>
      <div>
        {postsNotFound
          ? <p>Posts not found</p>
          : <p>Find {totalPosts} {totalPosts === 1 ? 'post' : 'posts'}</p>
        }
      </div>
      <PostListContainer>
        {posts?.map((post, id) => <MyPostCard key={id} post={post}/>)}
      </PostListContainer>
      {countPages > 1 &&
        <PaginationContainer>
          <Pagination>
            {Array.from({ length: countPages }, (_, index) => (
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

export default MyPostList;
