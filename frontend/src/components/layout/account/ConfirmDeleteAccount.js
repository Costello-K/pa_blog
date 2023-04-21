import { Link } from 'react-router-dom';

function ConfirmDeleteAccount() {
  return (
		<div>
			<p>Your account has been deleted!</p>
			<p>Go <Link to='/'>home</Link></p>
		</div>
  )
};

export default ConfirmDeleteAccount;
