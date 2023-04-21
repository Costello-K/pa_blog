import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { FaTrashAlt, FaThumbsUp, FaThumbsDown, FaReply, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import ReplyCommentForm from './ReplyCommentForm';
import { BASE_URL } from '../../../constants';
import { setComments } from '../../../store/postCommentSlice';

const IconWrapper = styled.div`
  margin-right: 20px;
  &.reply {
    border: 1px solid #adb5bd;
    border-radius: 8px;
    padding: 0 10px;
    background: #f8f9fa; 
    &:hover {
      border: 1px solid #ced4da;
      background: #ced4da; 
    }
  }
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
    &.delete {
      color: #A52A2A;
    }
  }
`;

const LinkAuthor = styled(Link)`
    text-decoration: none;
    color: #1C1C1C;
    &:hover {
      color: black;
    }
`;

function Comment({ comment }) {
  const { id, author, text, likes, dislikes, children, liked, disliked, created_at } = comment;
  const postId = useSelector(state => state.postComments.postId);
  const authUserId = useSelector(state => state.auth.userId);
  const page_size = useSelector(state => state.postComments.comments.length);
  const [showFormReply, setShowFormReply] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [like, setLike] = useState(liked);
  const [dislike, setDislike] = useState(disliked);
  const [countLikes, setCountLikes] = useState(likes);
  const [countDislikes, setCountDislikes] = useState(dislikes);
  const dispatch = useDispatch();
  const date = new Date(created_at);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString('eu-UA', {hour: 'numeric', minute: 'numeric'});

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFormReply]);

  const closeForm = () => setShowFormReply(false);

  const handleClickOutside = e => {
    if (e.target.closest(".comment-form")) return;
    setShowFormReply(false);
  };

  const getUserName = user => {
    if (!user) return null;
    return user.name || user.surname ? `${user.name} ${user.surname}` : user.nickname;
  };

  const deleteComment = () => {
    // remove comment
    axios.delete(`${BASE_URL}/v1/reviews/delete/${id}/`)
      .then(res => {
        // if comment has been removed - update the list of comments
        axios.get(`${BASE_URL}/v1/posts/reviews/${postId}/?page_size=${page_size}`)
          .then(res => dispatch(setComments(res.data.results)))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };

  const likeComment = () => {
    axios.post(`${BASE_URL}/v1/like_review/${id}/`)
      .then(res => {
        setLike(res.data.liked);
        setDislike(res.data.disliked);
        setCountLikes(res.data.likes);
        setCountDislikes(res.data.dislikes);
      })
      .catch(err => console.error(err));
  };

  const dislikeComment = () => {
    axios.post(`${BASE_URL}/v1/dislike_review/${id}/`)
      .then(res => {
        setLike(res.data.liked);
        setDislike(res.data.disliked);
        setCountLikes(res.data.likes);
        setCountDislikes(res.data.dislikes);
      })
      .catch(err => console.error(err));
  };

  const openFormReply = () => {
    setShowFormReply(!showFormReply);
    !showReply && setShowReply(!showReply);
  }

  const childrenCommentList = comments => {
    return (
      <>
        {comments?.map((comment, id) => <Comment key={id} comment={comment} />)}
      </>
    )
  };

  return (
    <>
      <div className="comment-form">
        <Card.Body>
          <div className="d-flex justify-content-sm-between" style={{marginBottom: '10px'}}>
            <Card.Subtitle className="mb-2 text-muted">
              <LinkAuthor to={`/users/${author?.id}/${author?.nickname}`}>
                {getUserName(author)}
              </LinkAuthor>
            </Card.Subtitle>
            <p style={{fontSize: '14px', marginBottom: 0}}>{dateString} {timeString}</p>
          </div>
          <Card.Text>{text}</Card.Text>
          <div className="d-flex justify-content-sm-between">
            <div>
              {children?.length > 0 &&
                <IconWrapper className='reply' onClick={() => setShowReply(!showReply)}>
                  {!showReply && <FaCaretDown style={{marginRight: '5px'}}/>}
                  {showReply && <FaCaretUp style={{marginRight: '5px'}}/>}
                  {children?.length} replies
                </IconWrapper>
              }
            </div>
            <div className="d-flex justify-content-end">
              {authUserId === author?.id &&
                <IconWrapper className="delete"><FaTrashAlt onClick={deleteComment}/></IconWrapper>
              }
              <IconWrapper className='like' like={like}><FaThumbsUp style={{marginRight: '5px'}} onClick={likeComment}/>{countLikes}</IconWrapper>
              <IconWrapper className='dislike' dislike={dislike}><FaThumbsDown style={{marginRight: '5px'}} onClick={dislikeComment}/>{countDislikes}</IconWrapper>
              <div onClick={openFormReply} style={{cursor: "pointer"}}><FaReply/></div>
            </div>
          </div>
          <hr/>
          {showFormReply &&
            <ReplyCommentForm commentId={id} closeForm={closeForm}/>
          }
          {showReply && childrenCommentList(children)}
        </Card.Body>
      </div>
    </>
  )
};

export default Comment;
