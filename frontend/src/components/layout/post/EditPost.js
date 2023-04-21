import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaStar, FaTimes } from 'react-icons/fa';
import 'react-image-gallery/styles/css/image-gallery.css';

import { BASE_URL } from '../../../constants';

const MAX_IMAGES = 8;
const MAX_FILE_SIZE_MB = 5;

const FormContainer = styled.div`
  width: 100%;
  margin: 20px auto;
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

function EditPost() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [defaultFormData, setDefaultFormData] = useState({});
  const [images, setImages] = useState([]);
  const [listDelImages, setListDelImages] = useState([]);

  useEffect(() => {
    // get post data
    axios.get(`${BASE_URL}/v1/posts/${id}/`)
      .then(res => {
        const data = res.data;
        Object.keys(data).forEach(key => {
          if (key === 'tags') {
            setDefaultFormData(prevState => ({...prevState, tags: data['tags'].map(item => item.name).join(" ")}))
          } else if (['title', 'text', 'status'].includes(key)) {
            setDefaultFormData(prevState => ({...prevState, [key]: data[key]}))
          }
        })
        setImages(data.images);
      })
      .catch(err => console.error(err));
  }, [id]);

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
      }
    }
  };

  const handleImageRemove = (index, id= null) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    if (id !== null) {
      setListDelImages([...listDelImages, id])
    }
    setImages(newImages);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const formInputs = Array.from(e.target.elements);
    const data = new FormData();

    if (images.length > 0) {
      images.forEach((image, i) => {
        if (image instanceof File) {
          data.append(`images[${i}]image`, image)
        }
      })
    };

    formInputs.forEach((input, i) => {
      if (input.name === 'tags' && input.value) {
        const tags = input.value.trim().split(/\s+/).filter((tag, index, tagsArray) => tagsArray.indexOf(tag) === index).slice(0, 20)
        tags.forEach((tag, i) => data.append(`tags[${i}]name`, tag))
      } else if (['title', 'text', 'status'].includes(input.name)) {
        data.append(input.name, input.value);
      };
    });

    // array of promises to remove images
    const deleteImagePromises = listDelImages.map(id => axios.delete(`${BASE_URL}/v1/posts/images/delete/${id}/`));
    Promise.all(deleteImagePromises)
      .then(responses => {
        // edit post
        axios.put(`${BASE_URL}/v1/posts/edit/${id}/`, data, {
          headers: {'Content-Type': 'multipart/form-data'}
        })
        .then(res => {
          // redirect to modified post
          navigate(`/posts/${id}/${slug}/`)
        })
        .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };

  return (
		<div>
				<FormContainer border='0'>
					<Form onSubmit={handleSubmit}>
            <div>
              <ImagesContainer>
                {images?.map((file, i) => (
                  <ImageWrapper key={i}>
                    <InnerWrapper>
                      <Image src={file instanceof File ? URL.createObjectURL(file) : file.image} alt={`Image ${i}`} />
                      <Overlay>
                        <RemoveBtn type='button' onClick={() => handleImageRemove(i, file?.id)}><IconFaTimes/></RemoveBtn>
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
              <Form.Control as='textarea' rows={2} defaultValue={defaultFormData.tags} placeholder='Enter your tags' name='tags' />
            </Form.Group>
            <Form.Group controlId='title' style={{marginTop: '15px'}}>
              <Form.Label>Title <Star /></Form.Label>
              <Form.Control as='textarea' rows={2} defaultValue={defaultFormData.title} placeholder='Enter your title' name='title' />
            </Form.Group>
            <Form.Group controlId='text' style={{marginTop: '15px'}}>
              <Form.Label>Text <Star /></Form.Label>
              <Form.Control as='textarea' rows={10} defaultValue={defaultFormData.text} placeholder="Enter your text" name='text' />
            </Form.Group>
            <Form.Group controlId='status' style={{marginTop: '15px'}}>
              <Form.Label>Status published</Form.Label>
              <Form.Control as='select' name='status' defaultValue=''>
                <option selected={defaultFormData.status === 'draft' ? 'draft' : ''} value='draft'>Draft</option>
                <option selected={defaultFormData.status === 'published' ? 'selected' : ''} value='published'>Published</option>
              </Form.Control>
            </Form.Group>
						<div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button variant='secondary' type='submit' style={{ marginTop: '15px', marginLeft: 'auto'}}>Save changes</Button>
            </div>
					</Form>
				</FormContainer>
		</div>
  )
};

export default EditPost;
