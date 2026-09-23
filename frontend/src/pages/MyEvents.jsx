import { useEffect, useState } from "react";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    capacity: "",
  });

  const fetchMyEvents = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "/api/my-events",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login?expired=true";
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to load your events");
    }

    setEvents(data.events);
  };

  useEffect(() => {
    fetchMyEvents().catch((error) => {
      console.error("My Events error:", error);
      setError(error.message);
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsCreating(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            location: form.location,
            event_date: form.event_date,
            capacity: Number(form.capacity),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login?expired=true";
        return;
      }

      if (!response.ok) {
        setError(data.message || "Failed to create event");
        return;
      }

      setMessage("Event created successfully!");

      setForm({
        title: "",
        description: "",
        location: "",
        event_date: "",
        capacity: "",
      });

      await fetchMyEvents();

      setShowCreateForm(false);
    } catch (error) {
      console.error("Create event error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) {
      return;
    }

    setError("");
    setMessage("");
    setIsDeleting(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `/api/my-events/${eventToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login?expired=true";
        return;
      }

      if (!response.ok) {
        setError(data.message || "Failed to delete event");
        return;
      }

      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) => event.id !== eventToDelete.id
        )
      );

      setMessage("Event deleted successfully.");
      setEventToDelete(null);
    } catch (error) {
      console.error("Delete event error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setError("");
    setMessage("");

    setForm({
      title: "",
      description: "",
      location: "",
      event_date: "",
      capacity: "",
    });
  };

  return (
    <section className="events-section">
      <div className="events-header">
        <h2>My Events</h2>
        <p>Events you've created on EventBook.</p>
      </div>

      {message && (
        <p className="profile-success">
          {message}
        </p>
      )}

      {error && (
        <p className="profile-error">
          {error}
        </p>
      )}

      <div className="create-event-header">
        <div>
          <h3>Your Events</h3>
          <p>Create and manage your EventBook events.</p>
        </div>

        <button
          className="create-event-button"
          onClick={() => {
            setShowCreateForm((current) => !current);
            setError("");
            setMessage("");
          }}
        >
          {showCreateForm ? "Close" : "+ Create Event"}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-event-card">
          <h3>Create a New Event</h3>

          <form onSubmit={handleCreateEvent}>
            <input
              type="text"
              name="title"
              placeholder="Event title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Event description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Event location"
              value={form.location}
              onChange={handleChange}
              required
            />

            <input
              type="datetime-local"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="capacity"
              placeholder="Maximum attendees"
              value={form.capacity}
              onChange={handleChange}
              min="1"
              required
            />

            <div className="create-event-actions">
              <button
                type="submit"
                disabled={isCreating}
              >
                {isCreating
                  ? "Creating Event..."
                  : "Create Event"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="events-header">
        <h3>Your Events</h3>
      </div>

      {events.length === 0 && !error ? (
        <div className="empty-bookings">
          <div className="empty-bookings-icon">📅</div>

          <h3>No events yet</h3>

          <p>
            You haven't created any events yet.
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              <span className="event-card-label">
                My Event
              </span>

              <h3>{event.title}</h3>

              <p>{event.description}</p>

              <div className="event-card-info">
                <span>📍 {event.location}</span>

                <span>
                  📅 {new Date(event.event_date).toLocaleString()}
                </span>

                <span>
                  👥 Capacity: {event.capacity}
                </span>
              </div>

              <button
                className="delete-event-button"
                onClick={() => setEventToDelete(event)}
              >
                Delete Event
              </button>
            </div>
          ))}
        </div>
      )}

      {eventToDelete && (
        <div
          className="delete-modal-overlay"
          onClick={() => {
            if (!isDeleting) {
              setEventToDelete(null);
            }
          }}
        >
          <div
            className="delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delete-modal-icon">
              ⚠️
            </div>

            <h3>Delete Event?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{eventToDelete.title}</strong>?
            </p>

            <p className="delete-modal-warning">
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                className="delete-modal-cancel"
                onClick={() => setEventToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="delete-modal-confirm"
                onClick={handleDeleteEvent}
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyEvents;