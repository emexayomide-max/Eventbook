import { useEffect, useState } from "react";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/login?expired=true";
          return null;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings");
        }

        return data;
      })
      .then((data) => {
        if (data) {
          console.log(data);
          setBookings(data.bookings);
        }
      })
      .catch((error) => {
        console.error("Bookings error:", error);
      });
  }, []);

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3001/api/bookings/${bookingId}`,
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
        throw new Error(data.message || "Failed to cancel booking");
      }

      console.log("Cancel response:", data);

      setBookings((currentBookings) =>
        currentBookings.filter((booking) => booking.id !== bookingId)
      );
    } catch (error) {
      console.error("Cancel booking error:", error);
    }
  };

  return (
    <section className="bookings-section">
      <div className="bookings-header">
        <h2>My Bookings</h2>
        <p>View and manage the events you've booked.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <div className="empty-bookings-icon">🎟️</div>

          <h3>No bookings yet</h3>

          <p>
            You haven't booked any events yet. Explore upcoming events
            and reserve your spot.
          </p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-icon">📅</div>

              <div className="booking-content">
                <h3>{booking.title}</h3>

                <p>📍 {booking.location}</p>

                <p>
                  📅 {new Date(booking.event_date).toLocaleString()}
                </p>

                <span>Booking ID: {booking.id}</span>
              </div>

              <button onClick={() => handleCancel(booking.id)}>
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Bookings;