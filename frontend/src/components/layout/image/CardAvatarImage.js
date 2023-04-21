import React from 'react';

import { BASE_URL } from '../../../constants';

function CardAvatarImage({ src }) {
  return (
    <img
      src={`${BASE_URL}${src}`}
      alt='Avatar'
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        objectFit: 'cover',
      }}
    />
  )
};

export default CardAvatarImage;
