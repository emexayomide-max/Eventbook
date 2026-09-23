import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/profile", {
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
          throw new Error(data.message || "Failed to load profile");
        }

        return data;
      })
      .then((data) => {
        if (data) {
          setProfile(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
        }
      })
      .catch((error) => {
        console.error("Profile error:", error);
        setError(error.message);
      });
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
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
        setError(data.message || "Failed to update profile");
        return;
      }

      setProfile(data.user);

      setName(data.user.name);
      setEmail(data.user.email);

      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Unable to connect to the server.");
    }
  };

  const handleCancel = () => {
    setName(profile.name);
    setEmail(profile.email);

    setIsEditing(false);

    setMessage("");
    setError("");
  };

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <section className="profile-section">
      <div className="profile-card">
        <div className="profile-avatar">👤</div>

        <h2>My Profile</h2>

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

        {!isEditing ? (
          <>
            <div className="profile-info">
              <div>
                <span>Name</span>
                <p>{profile.name}</p>
              </div>

              <div>
                <span>Email</span>
                <p>{profile.email}</p>
              </div>
            </div>

            <button
              className="profile-edit-button"
              onClick={() => {
                setIsEditing(true);
                setMessage("");
                setError("");
              }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-field">
              <label htmlFor="profile-name">
                Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-email">
                Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="profile-actions">
              <button
                type="submit"
                className="profile-save-button"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default Profile;