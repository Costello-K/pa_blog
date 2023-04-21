import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';

import { BASE_URL } from '../../../constants';
import PostCard from './PostCard';

const PostListContainer = styled.div`
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

function PostList() {
  const [posts, setPosts] = useState([]);
  const [searchPost, setSearchPost] = useState('');
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount ] = useState(0);
  const [totalPosts, setTotalPosts ] = useState(0);
  const [postsNotFound, setPostsNotFound] = useState(false);

  useEffect(() => {
    setPostsNotFound(false);

    // get list of posts by search parameters
    axios.get(`${BASE_URL}/v1/posts/?page=${page}&search=${searchPost}`)
      .then(res => {
        setPosts(res.data.results);
        setPagesCount(res.data.total_pages);
        setTotalPosts(res.data.count);

        if (res.data.results.length === 0) {
          setPostsNotFound(true)
        };

      })
      .catch(err => console.log(err));
  }, [page, searchPost]);

  const handleChangeSearch = e => {
    setSearchPost(e.target.value);
    setPage(1);
  };

  const handlePageChange = pageNumber => setPage(pageNumber);

  return (
    <>
      <h3 style={{textAlign: 'center'}}>All posts</h3>
      <form>
        <input className="form-control" type="search" placeholder="Search post" aria-label="Search" onChange={handleChangeSearch}></input>
      </form>
      <div>
        {postsNotFound
          ? <p>Posts not found</p>
          : <p>Find {totalPosts} {totalPosts === 1 ? 'post' : 'posts'}</p>
        }
      </div>
      <PostListContainer>
        {posts && posts.map((post, id) => <PostCard key={id} post={post}/>)}
      </PostListContainer>
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

export default PostList;
