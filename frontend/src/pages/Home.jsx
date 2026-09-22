import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🎟️ Discover something memorable</span>

          <h2>Discover Events. Make Memories.</h2>

          <p>
            Find exciting events, reserve your spot, and manage all your
            bookings in one simple place.
          </p>

          <Link to="/events">
            <button>Explore Events</button>
          </Link>
        </div>
      </section>

      <section className="home-features">
        <div className="feature">
          <div className="feature-icon">🔎</div>
          <h3>Discover Events</h3>
          <p>
            Explore upcoming events and find something you'll enjoy.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">🎟️</div>
          <h3>Book Your Spot</h3>
          <p>
            Secure your place at an event with a simple booking process.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">📅</div>
          <h3>Manage Bookings</h3>
          <p>
            View and manage your upcoming event bookings from your account.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;