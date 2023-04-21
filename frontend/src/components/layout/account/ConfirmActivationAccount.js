import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import { BASE_URL } from '../../../constants';


function ConfirmActivationAccount() {
	const [activation, setActivation] = useState(false);
	const { uid, token } = useParams();
	const formData = {
		uid: uid,
		token: token,
	};

  React.useEffect(() => {
		// send request to activate your account
		axios.post(`${BASE_URL}/auth/users/activation/`, formData,{
        headers: { 'Content-Type': 'application/json'}
      })
        .then(res => res.status === 204 && setActivation(true))
        .catch(err => console.error(err));
	}, []);

  return (
    <div>
			{!activation && <p>Your account has not been activated. Try again.!</p>}
      {activation && (
        <div>
          <p>Your account is activated!</p>
          <p>
            <Link to="/users/login">Click here to login.</Link>
          </p>
        </div>
      )}
		</div>
  )
};

export default ConfirmActivationAccount;
