import React, { useState, useEffect } from "react";
import axios from "../services/api";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    dateOfBirth: "",
    currency: "USD",
    monthlyBudgetGoal: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile");
        setProfile(res.data);
        if (res.data.profilePicture) {
          setPreviewImage(`https://expensetrackerbackend-ga82.onrender.com${res.data.profilePicture}`);
        }
      } catch (err) {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Add all profile fields
      Object.keys(profile).forEach((key) => {
        if (profile[key]) {
          formData.append(key, profile[key]);
        }
      });

      // Add the profile picture file if it exists
      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      await axios.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Settings</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-form-content">
            <div className="profile-picture-section">
              <div className="profile-picture-container">
                <img
                  src={previewImage || "/default-profile.png"}
                  alt="Profile"
                  className="profile-picture"
                />
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="profile-picture-input"
                />
                <label htmlFor="profilePicture" className="upload-btn">
                  {previewImage ? "Change Photo" : "Upload Photo"}
                </label>
              </div>
            </div>

            <div className="profile-fields-section">
              <div className="form-group">
                <label>Name*</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Preferred Currency</label>
                <select
                  name="currency"
                  value={profile.currency}
                  onChange={handleChange}
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Monthly Budget Goal</label>
                <input
                  type="number"
                  name="monthlyBudgetGoal"
                  value={profile.monthlyBudgetGoal}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-content">
            <div className="profile-picture-section">
              <img
                src={previewImage || "/default-profile.png"}
                alt="Profile"
                className="profile-picture"
              />
            </div>

            <div className="profile-info-section">
              <div className="profile-info">
                <p>
                  <strong>Name:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone || "Not provided"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {profile.dateOfBirth || "Not provided"}
                </p>
                <p>
                  <strong>Bio:</strong> {profile.bio || "No bio provided"}
                </p>
                <p>
                  <strong>Currency:</strong> {profile.currency}
                </p>
                <p>
                  <strong>Monthly Budget Goal:</strong>{" "}
                  {profile.monthlyBudgetGoal || "Not set"}
                </p>
              </div>
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
