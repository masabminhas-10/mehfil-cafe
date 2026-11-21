import { Link } from 'react-router-dom';
import RulesBanner from '../components/RulesBanner.jsx';

function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Mehfil Café — pre-order your meal and book a table in Islamabad</h1>
        <p>
          Desi comfort food for families and friends. Pick your dishes now, choose a time, and your food is ready
          when you sit down.
        </p>
        <Link to="/menu" className="btn btn-primary btn-large">
          Browse today's menu
        </Link>
      </section>

      <RulesBanner />

      <section aria-labelledby="steps-heading">
        <h2 id="steps-heading">How it works</h2>
        <ol className="steps">
          <li>Choose dishes from the menu. Dietary info and portions left are shown on every dish.</li>
          <li>Review your order and adjust quantities or spice level.</li>
          <li>Enter your booking details and confirm. (Simulated — no payment is taken.)</li>
        </ol>
      </section>
    </>
  );
}

export default HomePage;
