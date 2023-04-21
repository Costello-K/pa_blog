import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';
import styled from 'styled-components';
import { FaRegEye, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import 'react-image-gallery/styles/css/image-gallery.css';

import Tag from '../Tag';
import { BASE_URL } from '../../../constants';
import CommentList from '../comment/CommentList';
import { setPostId } from '../../../store/postCommentSlice';

const PostCard = styled(Card)`
  width: 100%;
  margin: 20px auto;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const GalleryWrapper = styled.div`
  .image-gallery-content .image-gallery-slide {
    background-color: #BDBDBD;
  }
  
  .image-gallery-content .image-gallery-slides .image-gallery-image {
    height: 600px;
    max-width: 100%;
  }
  
  .image-gallery-content.fullscreen .image-gallery-slide {
    background-color: black;
  }
  
  .image-gallery-content.fullscreen .image-gallery-slides .image-gallery-image {
    height: calc(100vh - 150px);
    max-width: 100%;
  }

  .image-gallery-thumbnail .image-gallery-thumbnail-image {
    max-height: 130px;
  }
`;

const IconWrapper = styled.div`
  margin-right: 20px;
  color: black;
  &.like {
    ${props => props.like
      ? 'color: black;'
      : 'color: gray;'
    }
  }
  &.dislike {
    ${props => props.dislike
      ? 'color: black;'
      : 'color: gray;'
    }
  }
  &:hover {
    cursor: pointer;
  }
`;

const LinkAuthor = styled(Link)`
  text-decoration: none;
  color: #1C1C1C;
  &:hover {
    color: black;
  }
`;

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const dispatch = useDispatch();
  dispatch(setPostId(id));

  // get post data
  useEffect(() => {
    axios.get(`${BASE_URL}/v1/posts/${id}/`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const { author, images, tags, title, text, views, likes, dislikes, liked, disliked } = post;

  function getUserName(user) {
    if (!user) return null;
    return user.name || user.surname ? `${user.name} ${user.surname}` : user.nickname;
  };

  const imagesArray = images?.map((item, id) => ({
    original: item.image,
    thumbnail: item.image,
  }));

  function likePost(){
    axios.post(`${BASE_URL}/v1/like_post/${id}/`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  };

  function dislikePost(){
    axios.post(`${BASE_URL}/v1/dislike_post/${id}/`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  };

  return (
    <PostCard className="h-100">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted" style={{marginTop: '20px'}}><LinkAuthor to={`/users/${author?.id}/${author?.nickname}`}>{getUserName(author)}</LinkAuthor></Card.Subtitle>
        {tags?.length > 0 &&
          <TagsList>
            {tags.map((tag, id) => <Tag key={id} pill variant="primary" className="mr-1" tag={tag}/>)}
          </TagsList>
        }
        {images?.length > 0 &&
          <GalleryWrapper style={{marginTop: '20px', marginBottom: '30px'}}>
            <ImageGallery items={imagesArray} showFullscreenButton={true} showPlayButton={false} />
          </GalleryWrapper>
        }
        <Card.Text>{text}</Card.Text>
        <hr />
        <div className="d-flex justify-content-end">
          <IconWrapper className='view'><FaRegEye style={{marginRight: '5px'}} />{views}</IconWrapper>
          <IconWrapper className='like' like={liked}><FaThumbsUp onClick={likePost} style={{marginRight: '5px'}} />{likes}</IconWrapper>
          <IconWrapper className='dislike' dislike={disliked}><FaThumbsDown onClick={dislikePost} style={{marginRight: '5px'}} />{dislikes}</IconWrapper>
        </div>
        <hr />
        <Card.Title>Comments</Card.Title>
        <CommentList />
      </Card.Body>
    </PostCard>
  )
};

export default PostDetails;
