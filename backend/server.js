const express = require("express");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/auth");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "eventbook-backend"
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");

    res.json({
      status: "connected",
      database: result.rows[0].current_database
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      status: "error",
      message: "Database connection failed"
    });
  }
});

app.post("/api/events", async (req, res) => {
  const {
    title,
    description,
    location,
    event_date,
    capacity
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO events
        (title, description, location, event_date, capacity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, location, event_date, capacity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating event:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to create event"
    });
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM events ORDER BY event_date ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching events:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch events"
    });
  }
});

app.get("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Event not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching event:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch event"
    });
  }
});

app.put("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    location,
    event_date,
    capacity
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE events
       SET title = $1,
           description = $2,
           location = $3,
           event_date = $4,
           capacity = $5
       WHERE id = $6
       RETURNING *`,
      [title, description, location, event_date, capacity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Event not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating event:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to update event"
    });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Event not found"
      });
    }

    res.json({
      status: "success",
      message: "Event deleted successfully",
      event: result.rows[0]
    });
  } catch (error) {
    console.error("Error deleting event:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to delete event"
    });
  }
});

app.post("/api/users/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      status: "success",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error registering user:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to register user"
    });
  }
});

app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password"
      });
    }
   
    const token = jwt.sign(
  {
    id: user.id,
    email: user.email
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h"
  }
);

   res.json({
  status: "success",
  message: "Login successful",
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email
  }
    });
  } catch (error) {
    console.error("Error logging in:", error.message);

    res.status(500).json({
      status: "error",
      message: "Login failed"
    });
  }
});

app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    res.json({
      status: "success",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch profile"
    });
  }
});

app.post("/api/bookings", authenticateToken, async (req, res) => {
  const { event_id } = req.body;

  if (!event_id) {
    return res.status(400).json({
      status: "error",
      message: "event_id is required"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the event row while we check capacity
    const eventResult = await client.query(
      "SELECT * FROM events WHERE id = $1 FOR UPDATE",
      [event_id]
    );

    if (eventResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        status: "error",
        message: "Event not found"
      });
    }

    const event = eventResult.rows[0];

    // Count existing bookings
    const bookingCountResult = await client.query(
      "SELECT COUNT(*) FROM bookings WHERE event_id = $1",
      [event_id]
    );

    const bookingCount = Number(
      bookingCountResult.rows[0].count
    );

    if (bookingCount >= event.capacity) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        status: "error",
        message: "Event is fully booked"
      });
    }

    // Create the booking
    const result = await client.query(
      `INSERT INTO bookings (user_id, event_id)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user.id, event_id]
    );

    await client.query("COMMIT");

    res.status(201).json({
      status: "success",
      message: "Booking created successfully",
      booking: result.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");

    // Duplicate booking
    if (error.code === "23505") {
      return res.status(409).json({
        status: "error",
        message: "You have already booked this event"
      });
    }

    console.error("Error creating booking:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to create booking"
    });
  } finally {
    client.release();
  }
});

app.get("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         bookings.id,
         bookings.created_at,
         events.id AS event_id,
         events.title,
         events.location,
         events.event_date
       FROM bookings
       JOIN events ON bookings.event_id = events.id
       WHERE bookings.user_id = $1
       ORDER BY events.event_date ASC`,
      [req.user.id]
    );

    res.json({
      status: "success",
      bookings: result.rows
    });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch bookings"
    });
  }
});

app.delete("/api/bookings/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM bookings
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found"
      });
    }

    res.json({
      status: "success",
      message: "Booking cancelled successfully",
      booking: result.rows[0]
    });
  } catch (error) {
    console.error("Error cancelling booking:", error.message);

    res.status(500).json({
      status: "error",
      message: "Failed to cancel booking"
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});


app.listen(PORT, () => {
  console.log(`EventBook backend running on port ${PORT}`);
});