import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";

function Events() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "/api/events"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load events"
        );
      }

      setEvents(data);
    } catch (error) {
      console.error("Events error:", error);

      setError(
        "Unable to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    const title = event.title?.toLowerCase() || "";
    const location = event.location?.toLowerCase() || "";

    return (
      title.includes(search) ||
      location.includes(search)
    );
  });

  return (
    <section className="events-section">
      <div className="events-header">
        <h2>Upcoming Events</h2>

        <p>
          Browse available events and book your spot.
        </p>
      </div>

      {!loading && !error && events.length > 0 && (
        <div className="event-search">
          <input
            type="text"
            placeholder="Search by event name or location..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>
      )}

      {loading && (
        <div className="empty-bookings">
          <div className="empty-bookings-icon">
            📅
          </div>

          <h3>Loading events...</h3>

          <p>
            We're getting the latest events for you.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="empty-bookings">
          <div className="empty-bookings-icon">
            ⚠️
          </div>

          <h3>Unable to load events</h3>

          <p>{error}</p>

          <button
            className="create-event-button"
            onClick={() => {
              setLoading(true);
              setError("");
              fetchEvents();
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        events.length === 0 && (
          <div className="empty-bookings">
            <div className="empty-bookings-icon">
              📅
            </div>

            <h3>No upcoming events</h3>

            <p>
              There are no events available right now.
              Check back later for new events.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        events.length > 0 &&
        filteredEvents.length === 0 && (
          <div className="empty-bookings">
            <div className="empty-bookings-icon">
              🔍
            </div>

            <h3>No events found</h3>

            <p>
              Try searching for another event name or
              location.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        filteredEvents.length > 0 && (
          <>
            {searchTerm.trim() && (
  <div className="events-results-count">
    {filteredEvents.length}{" "}
    {filteredEvents.length === 1
      ? "event"
      : "events"}{" "}
    found
  </div>
)}

            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          </>
        )}
    </section>
  );
}

export default Events;