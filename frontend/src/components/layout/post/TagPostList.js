import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

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

function TagPostList() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesCount , setPagesCount ] = useState(0);
  const [totalPosts, setTotalPosts ] = useState(0);

  React.useEffect(() => {
    // get list of posts by tag
    axios.get(`${BASE_URL}/v1/tags/${slug}/?page=${page}`)
      .then(res => {
        setPosts(res.data.results);
        setTag(res.data.tag);
        setPagesCount(res.data.total_pages);
        setTotalPosts(res.data.count);
      })
      .catch(err => console.log(err));
  }, [slug, page]);

  const handlePageChange = pageNumber => setPage(pageNumber);

  return (
    <>
      <h3 style={{textAlign: 'center'}}>All posts including {tag} ({totalPosts} {totalPosts === 1 ? 'post' : 'posts'})</h3>
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

export default TagPostList;
