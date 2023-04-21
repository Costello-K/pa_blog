import { Link } from 'react-router-dom';

function ActivationAccount() {
  return (
		<div>
			<p>To activate your account, you should receive an email.</p>
			<p>After confirmation of activation <Link to="/users/login">click here to login.</Link></p>
		</div>
  )
};

export default ActivationAccount;
