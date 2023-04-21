import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{textAlign: 'center'}}>
      <h3>
        Page not found. Go <Link to='/' style={{textDecoration: 'none'}}>home</Link>
      </h3>
    </div>
  )
};

export default NotFoundPage;
