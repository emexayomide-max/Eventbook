import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <section className="events-section">
      <h2>Upcoming Events</h2>

      <p>Browse available events and book your spot.</p>

      <div className="events-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

export default Events;