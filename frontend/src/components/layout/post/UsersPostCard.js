import React from 'react';
import { Card } from 'react-bootstrap';
import { FaEye, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Tag from '../Tag';
import CardPostImage from '../image/CardPostImage';

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

function UserPostCard({ post }) {
  const { id, images, tags, title, published_at, views, likes, dislikes, slug } = post;
  const date = new Date(published_at).toLocaleDateString();

  return (
    <PostContainer>
      <PostImageContainer>
        {images && <CardPostImage src={images?.image}/>}
      </PostImageContainer>
      <PostDetails>
        {tags?.length > 0 &&
          <TagsList>
            {tags.map((tag, id) => <Tag key={id} pill variant="primary" className="mr-1" tag={tag}/>)}
          </TagsList>
        }
        <PostTitle><LinkTitle to={`/posts/${id}/${slug}`}>{title}</LinkTitle></PostTitle>
        <div style={{width: '100%'}}>
          <div className='d-flex justify-content-between' style={{marginTop: '7px'}}>
            <div>Published at: {date}</div>
            <div>
              <Span><FaEye className='mr-2' style={{marginRight: '5px'}} />{views}</Span>
              <Span><FaThumbsUp className='mr-2' style={{marginRight: '5px'}} />{likes}</Span>
              <Span><FaThumbsDown className='mr-2' style={{marginRight: '5px'}} />{dislikes}</Span>
            </div>
          </div>
        </div>
      </PostDetails>
    </PostContainer>
  )
};

export default UserPostCard;
