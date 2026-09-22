import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/events/${id}`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load event");
        }

        return data;
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setError(error.message);
      });
  }, [id]);

  const handleBooking = async () => {
    setMessage("");
    setError("");
    setIsBooking(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before booking an event.");
      setIsBooking(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            event_id: id,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login?expired=true";
        return;
      }

      if (response.status === 409) {
        setError(data.message || "Unable to complete booking.");
        return;
      }

      if (!response.ok) {
        setError(data.message || "Failed to book this event.");
        return;
      }

      setMessage("🎉 Booking successful! Your spot has been reserved.");
    } catch (error) {
      console.error("Booking error:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (!event) {
    return (
      <section className="event-details-section">
        {error ? (
          <p className="profile-error">{error}</p>
        ) : (
          <p>Loading event...</p>
        )}
      </section>
    );
  }

  return (
    <section className="event-details-section">
      <div className="event-details-card">
        <span className="event-label">Upcoming Event</span>

        <h2>{event.title}</h2>

        <p className="event-details-description">
          {event.description}
        </p>

        <div className="event-details-info">
          <div>
            <span>Location</span>
            <p>📍 {event.location}</p>
          </div>

          <div>
            <span>Date & Time</span>
            <p>
              📅 {new Date(event.event_date).toLocaleString()}
            </p>
          </div>

          <div>
            <span>Capacity</span>
            <p>👥 {event.capacity} people</p>
          </div>
        </div>

        {message && (
          <p className="booking-success">
            {message}
          </p>
        )}

        {error && (
          <p className="booking-error">
            {error}
          </p>
        )}

        <button
          onClick={handleBooking}
          className="booking-button"
          disabled={isBooking}
        >
          {isBooking ? "Booking..." : "Book This Event"}
        </button>
      </div>
    </section>
  );
}

export default EventDetails;