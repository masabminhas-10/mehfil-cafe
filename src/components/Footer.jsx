import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          Mehfil Café · Block 5, Clifton, Karachi · Open daily 12:30 pm – 11:00 pm
        </p>
        <p className="small">
          Student project: all bookings are simulated. No real table is reserved and no payment is taken.{' '}
          <Link to="/demo">Demo settings</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
