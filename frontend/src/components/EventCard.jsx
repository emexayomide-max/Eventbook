import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <article className="event-card">
      <div className="event-card-icon">📅</div>

      <span className="event-label">Upcoming Event</span>

      <h3>{event.title}</h3>

      <p className="event-description">{event.description}</p>

      <div className="event-info">
        <p>📍 {event.location}</p>

        <p>🗓️ {new Date(event.event_date).toLocaleString()}</p>

        <p>👥 Capacity: {event.capacity}</p>
      </div>

      <Link to={`/events/${event.id}`} className="event-button">
        View Event
      </Link>
    </article>
  );
}

export default EventCard;