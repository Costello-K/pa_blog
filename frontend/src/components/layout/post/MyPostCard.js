import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';

import Tag from '../Tag'
import { BASE_URL } from '../../../constants';
import CardMyPostImage from '../image/CardMyPostImage';
import {
  setMyPosts,
  setMyPostsCountPages,
  setMyPostsCurrentPage,
  removeMyPostsStatus,
  setMyPostsCountPosts
} from '../../../store/myPostsSlice';

const PostContainer = styled(Card)`
  border-radius: 0;
  width: 100%;
  height: 100%;
  flex-direction: row;
  margin: 20px auto;
  padding: 15px;
  font-size: 14px;
  &:hover {
    border-color: white;
    -webkit-box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
    -moz-box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
    box-shadow: 0px 0px 20px 5px rgba(156,156,156,1);
  }
`;

const PostImageContainer = styled.div`
  width: 160px;
`;

const PostDetails = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 30px;
  box-sizing: border-box;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const PostStatus = styled.div`
  line-height: 1.4;
  font-size: 1.2rem;
  text-align: right;
  margin-bottom: 15px;
  font-weight: bold;
  ${props => props.status === 'draft'
    ? 'color: #dc3545;'
    : 'color: #146c43;'
  }
`;

const PostTitle = styled.div`
  line-height: 1.4;
  font-size: 1.2rem;
  text-align: left;
  margin-bottom: 5px;
`;

const Span = styled.span`
  margin-right: 10px;  
  color: gray;
`;

const LinkTitle = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: bold;
  &:hover {
    color: #0a58ca;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  text-align: right;
`;

const ButtonEl = styled(Button)`
  margin-left: 20px;
  border: 1px solid gray;
`;

function MyPostCard({ post }) {
  const { id, status, images, tags, title, created_at, published_at, updated_at, views, likes, dislikes, slug } = post;
  const statusMyPostList = useSelector(state => state.myPostList.status);
  const page = useSelector(state => state.myPostList.currentPage);
  const posts = useSelector(state => state.myPostList.posts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const date_create = new Date(created_at).toLocaleDateString();
  const date_published = published_at ? new Date(published_at).toLocaleDateString() : 'not published';
  const date_update = created_at === updated_at ? 'not updated': new Date(updated_at).toLocaleDateString();

  const editPost = id => navigate(`/posts/edit/${id}/${slug}`);

  const changeStatusPost = (id, status) => {
    // change post status
    axios.put(`${BASE_URL}/v1/posts/edit/${id}/`, {status: status === 'draft' ? 'published' : 'draft'}, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      .then(res => {
        if (status && statusMyPostList === status) {
          const newPage = page > 1 && posts.length === 1 ? page - 1 : page;

          // if the status of the post has changed - get my list of posts by search parameters
          axios.get(`${BASE_URL}/v1/users/me/posts/?page=${newPage}&search=&status=${statusMyPostList}`)
            .then(response => {
              const data = response.data;
              dispatch(setMyPosts(data.results));
              dispatch(setMyPostsCountPages(data.total_pages));
              dispatch(setMyPostsCountPosts(data.count));

              if (data.total_pages < page) {
                dispatch(setMyPostsCurrentPage(data.total_pages))
              };

              if (data.results.length === 0 && data.num_pages === 1) {
                dispatch(removeMyPostsStatus())
              };
            })
            .catch(err => console.log(err));
        } else {
          // if the status of the post has changed - get my list of posts by search parameters
          axios.get(`${BASE_URL}/v1/users/me/posts/?page=${page}&search=&status=${statusMyPostList}`)
            .then(response => dispatch(setMyPosts(response.data.results)))
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.error(err));
  };

  const deletePost = id => {
    // remove post
    axios.delete(`${BASE_URL}/v1/posts/delete/${id}`)
      .then(res => {
        const newPage = page > 1 && posts.length === 1 ? page - 1 : page;

        // if post is removed - get my list of posts by search parameters
        axios.get(`${BASE_URL}/v1/users/me/posts/?page=${newPage}&search=&status=${statusMyPostList}`)
          .then(res => {
            dispatch(setMyPosts(res.data.results));
            dispatch(setMyPostsCountPages(res.data.total_pages));

            if (res.data.total_pages < page){
              dispatch(setMyPostsCurrentPage(res.data.total_pages))
            };

            if (res.data.results.length === 0 && res.data.total_pages === 1) {
              dispatch(removeMyPostsStatus())
            };
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <PostContainer>
        <PostImageContainer>
          {images && <CardMyPostImage src={images?.image}/>}
        </PostImageContainer>
        <PostDetails>
          <PostStatus status={status}>{status.toUpperCase()}</PostStatus>
          {tags?.length > 0 &&
            <TagsList>
              {tags?.map((tag, id) => <Tag key={id} pill variant="primary" className="mr-1" tag={tag}/>)}
            </TagsList>
          }
          <PostTitle><LinkTitle to={`/posts/${id}/${slug}`}>{title}</LinkTitle></PostTitle>
          <div style={{width: "100%"}}>
            <div className='d-flex justify-content-between' style={{marginTop: '7px'}}>
              <div>
                <div>Created at: {date_create}</div>
                <div>Published at: {date_published}</div>
                <div>Updated at: {date_update}</div>
              </div>
              <div>
                <Span><FaEye className='mr-2' style={{marginRight: '5px'}} />{views}</Span>
                <Span><FaThumbsUp className='mr-2' style={{marginRight: '5px'}} />{likes}</Span>
                <Span><FaThumbsDown className='mr-2' style={{marginRight: '5px'}} />{dislikes}</Span>
              </div>
            </div>
          </div>
          <ButtonContainer>
            <ButtonEl variant='light' onClick={() => editPost(id, slug)}><FaEdit style={{marginLeft: '3px', marginBottom: '2px'}}/></ButtonEl>
            <ButtonEl variant='light' onClick={() => changeStatusPost(id, status)}>{status === 'draft' ? 'Published' : 'Move to drafts'}</ButtonEl>
            <ButtonEl variant='light' onClick={() => deletePost(id)}><FaTimes/></ButtonEl>
          </ButtonContainer>
        </PostDetails>
      </PostContainer>
    </>
  )
};

export default MyPostCard;
