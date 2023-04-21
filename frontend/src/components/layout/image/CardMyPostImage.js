import React from 'react';

import { BASE_URL } from '../../../constants';

function CardPostImage({ src }) {
  return (
    <img
      src={`${BASE_URL}${src}`}
      alt='Avatar'
      style={{
        width: '160px',
        height: '160px',
        borderRadius: '10px',
        objectFit: 'cover',
      }}
    />
  )
};

export default CardPostImage;
