import React from 'react';

import { BASE_URL } from '../../../constants';

function Avatar({ src }) {
  return (
    <img
      src={`${BASE_URL}${src}`}
      alt='Avatar'
      style={{
        width: '200px',
        height: '200px',
        borderRadius: '10px',
        objectFit: 'cover',
      }}
    />
  )
};

export default Avatar;
