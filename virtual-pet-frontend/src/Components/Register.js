import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Resources/Style/Register.css";
import wallpaper from '../Resources/Images/Backgrounds/BackgroundMain.webp';
import editIcon from '../Resources/Images/ProfileImages/editIcon.gif';

export default function Register() {
    const [profile, setProfile] = useState("defaultProfile");
    const [showProfileSelector, setShowProfileSelector] = useState(false);
    const [form, setForm] = useState({ name: "", username: "", password: "", email: "", profileImage: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const profileIcons = {
        defaultProfile: require("../Resources/Images/ProfileImages/profileIcon.png"),
        rangedProfile: require("../Resources/Images/ProfileImages/rangedProfile.png"),
        meleeProfile: require("../Resources/Images/ProfileImages/meleeProfile.png"),
        tankProfile: require("../Resources/Images/ProfileImages/tankProfile.png")
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleProfileSelection = (selectedProfile) => {
        setProfile(selectedProfile);
        setShowProfileSelector(false);
        setForm({ ...form, profileImage: selectedProfile }); // Guardar el nombre de la imagen seleccionada
    };

    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                console.log("User registered successfully");
                navigate('/login');
            } else {

                setErrorMessage("Username already exists. Please try again.");

            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
            console.error("Network error:", error);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-screen" style={{ backgroundImage: `url(${wallpaper})` }}>
            <div className="register-container">
                <h2>Register</h2>

                {/* Profile Icon Selector */}
                <div className="profile-selector" onClick={() => setShowProfileSelector(!showProfileSelector)}>
                    <img src={profileIcons[profile]} alt="Profile Icon" className="profile-image" />
                    <img src={editIcon} alt="Edit Icon" className="edit-icon" />
                </div>

                {showProfileSelector && (
                    <div className="profile-options">
                        {Object.entries(profileIcons).map(([key, src]) => (
                            <div key={key} className="profile-option" onClick={() => handleProfileSelection(key)}>
                                <img src={src} alt={key} className="profile-icon" />
                                <span>{key.replace("Profile", "")}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Input Fields */}
                <input type="text" placeholder="Name" name="name" onChange={handleInputChange} />
                <input type="text" placeholder="Username" name="username" onChange={handleInputChange} />
                <input type="password" placeholder="Password" name="password" onChange={handleInputChange} />
                <input type="email" placeholder="Email" name="email" onChange={handleInputChange} />

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {/* Register Button */}
                <button className="register-button" onClick={handleRegister}>Register</button>

                {/* Back to Login Button */}
                <button className="backToLogin-button" onClick={handleBackToLogin}>Back to Login</button>
            </div>
        </div>
    );
}