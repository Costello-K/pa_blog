import { Link } from 'react-router-dom';

function ResetPasswordSuccess() {
  return (
		<div>
			<p>The password has been changed. <Link to="/users/login">Click here to login.</Link></p>
		</div>
  )
};

export default ResetPasswordSuccess;
