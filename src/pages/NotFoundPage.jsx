import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="status-box">
      <h1>Page not found</h1>
      <p>This address doesn't exist on our site. You can start from the menu instead.</p>
      <Link to="/menu" className="btn btn-primary">
        Go to the menu
      </Link>
    </div>
  );
}

export default NotFoundPage;
