import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from "react-bootstrap";

const ButtonWrapper = styled(Button)`
  display: flex;
  align-items: center;
  height: 23px;
  margin-right: 5px;
  margin-bottom: 5px;
  border: 1px solid gray;
  background: #e9ecef;
  padding: 0 10px;
`;

const LinkTag = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: 400;
  font-size: 14px;
`;

function Tag({ tag }) {
  return (
    <ButtonWrapper variant='light'>
      <LinkTag to={`/tags/${tag.slug}`}>{tag.name}</LinkTag>
    </ButtonWrapper>
  )
};

export default Tag;
