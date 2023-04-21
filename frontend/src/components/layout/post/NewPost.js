import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import { FaStar, FaTimes } from 'react-icons/fa';
import 'react-image-gallery/styles/css/image-gallery.css';

import { BASE_URL } from '../../../constants';
import { setMyPosts, setMyPostsCountPages, setMyPostsCountPosts } from '../../../store/myPostsSlice';

const MAX_IMAGES = 8;
const MAX_FILE_SIZE_MB = 5;

const FormContainer = styled.div`
  border-bottom: 2px solid black;
  padding-bottom: 50px;
`;

const Star = styled(FaStar)`
  color: red; 
  height: 6px; 
  vertical-align: top;
  margin-top: 5px;
`;

const IconFaTimes = styled(FaTimes)`
  position: relative;
  margin-bottom: 5px;
`;

const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 10px;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;
`;

const InnerWrapper = styled.div`
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  &:hover {
    opacity: 1;
  }
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  display: block;
`;

const RemoveBtn = styled.button`
  border-radius: 50%;
  border: 1px solid;
  color: white;
  font-size: 20px;
  background-color: transparent;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  text-align: right;
  margin-bottom: 20px;
`;

const ButtonEl = styled(Button)`
  border: 1px solid gray;
`;

function NewPost() {
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(state => state.myPostList.status);

  const handleFileChange = e => {
    const newImages = [...images];
    let maxNumNewImages = MAX_IMAGES - newImages.length;

    for (let i = 0; i < e.target.files.length && i < maxNumNewImages; i++) {
      const file = e.target.files[i];
      if (file.size < (MAX_FILE_SIZE_MB * 1024 * 1024)) {
        newImages.push(file);
        setImages(newImages);
      } else {
        maxNumNewImages++
      };
    };
  };

  const handleImageRemove = index => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setImages([]);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const formInputs = Array.from(e.target.elements);
    const data = new FormData();

    if (images.length > 0) {
      images.forEach((image, i) => data.append(`images[${i}]image`, image))
    };

    formInputs.forEach((input, i) => {
      if (input.name === 'tags' && input.value) {
        const tags = input.value.trim().split(/\s+/).filter((tag, index, tagsArray) => tagsArray.indexOf(tag) === index).slice(0, 20);
        tags.forEach((tag, i) => {
          data.append(`tags[${i}]name`, tag);
        })
      } else if (['title', 'text', 'status'].includes(input.name)) {
        data.append(input.name, input.value);
      }
    });

    // create new post
    axios.post(`${BASE_URL}/v1/posts/create/`, data, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      .then(res => {
        toggleForm();

        // if the post is successfully created get my list of posts
        axios.get(`${BASE_URL}/v1/users/me/posts/?page=1&search=&status=${status}`)
        .then(res => {
          const data = res.data;
          dispatch(setMyPosts(data.results));
          dispatch(setMyPostsCountPages(data.total_pages));
          dispatch(setMyPostsCountPosts(data.count));
        })
        .catch(err => console.log(err));

      })
      .catch(err => console.error(err));
  };

  return (
		<>
			<ButtonContainer>
        <ButtonEl variant='light' onClick={() => toggleForm()}>Add new post</ButtonEl>
      </ButtonContainer>
			{showForm &&
				<FormContainer>
					<Form onSubmit={handleSubmit}>
            <div>
              <ImagesContainer>
                {images?.map((file, i) => (
                  <ImageWrapper key={i}>
                    <InnerWrapper>
                      <Image src={URL.createObjectURL(file)} alt={`Image ${i}`} />
                      <Overlay>
                        <RemoveBtn type='button' onClick={() => handleImageRemove(i)}><IconFaTimes/></RemoveBtn>
                      </Overlay>
                    </InnerWrapper>
                  </ImageWrapper>
                ))}
              </ImagesContainer>
              {images?.length < MAX_IMAGES && (
                <Form.Group controlId="formFileMultiple" className="mb-3" style={{marginTop: '15px'}}>
                  <Form.Label>Choose multiple files: (you can select up to {MAX_IMAGES - images.length} more files, each file must be less than 5 MB)</Form.Label>
                  <Form.Control type="file" accept="image/*" multiple onChange={handleFileChange} />
                </Form.Group>
              )}
            </div>
            <Form.Group controlId='tags' style={{marginTop: '15px'}}>
              <Form.Label>Tags (separate tags with spaces (no punctuation marks), specify no more than 20 tags)</Form.Label>
              <Form.Control as='textarea' rows={2} placeholder='Enter your tags' name='tags' />
            </Form.Group>
            <Form.Group controlId='title' style={{marginTop: '15px'}}>
              <Form.Label>Title <Star /></Form.Label>
              <Form.Control as='textarea' rows={2} placeholder='Enter your title' name='title' />
            </Form.Group>
            <Form.Group controlId='text' style={{marginTop: '15px'}}>
              <Form.Label>Text <Star /></Form.Label>
              <Form.Control as='textarea' rows={10} placeholder="Enter your text" name='text' />
            </Form.Group>
            <Form.Group controlId='status' style={{marginTop: '15px'}}>
              <Form.Label>Status published</Form.Label>
              <Form.Control as='select' name='status' >
                <option value='draft'>Draft</option>
                <option value='published'>Published</option>
              </Form.Control>
            </Form.Group>
						<div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button variant='secondary' type='submit' style={{marginTop: '15px', marginLeft: 'auto'}}>Save</Button>
            </div>
					</Form>
				</FormContainer>
			}
		</>
  )
};

export default NewPost;
