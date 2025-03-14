import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Resources/Style/Register.css";
import wallpaperWellcome from '../Resources/Images/optimized_background_4k.gif';
import editIcon from '../Resources/Images/ProfileImages/editIcon.gif'; 

export default function Register() {
    const [profile, setProfile] = useState("defaultProfile");
    const [showProfileSelector, setShowProfileSelector] = useState(false);
    const [form, setForm] = useState({ name: "", username: "", password: "", email: "" });
    const navigate = useNavigate();

    const profileIcons = {
        defaultProfile: require("../Resources/Images/ProfileImages/profileIcon.gif"),
        rangedProfile: require("../Resources/Images/ProfileImages/rangedProfile.png"),
        meleeProfile: require("../Resources/Images/ProfileImages/meleeProfile.png"),
        tankProfile: require("../Resources/Images/ProfileImages/tankProfile.png")
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {
        console.log("Registering with:", form);
        navigate('/login');
    };

    const handleBackToLogin = () => {
        navigate('/login'); // Redirigir a la pantalla de login
    };

    return (
        <div className="register-screen" style={{ backgroundImage: `url(${wallpaperWellcome})` }}>
            <div className="register-container">
                <h2>Register</h2>

                {/* Profile Icon Selector */}
                <div className="profile-selector" onClick={() => setShowProfileSelector(!showProfileSelector)}>
                    <img src={profileIcons[profile]} alt="Profile Icon" className="profile-image" />
                    <img src={editIcon} alt="Edit Icon" className="edit-icon" /> {/* Ícono de editar */}
                </div>


                {showProfileSelector && (
                    <div className="profile-options">
                        {Object.entries(profileIcons).map(([key, src]) => (
                            <div key={key} className="profile-option" onClick={() => { setProfile(key); setShowProfileSelector(false); }}>
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

                {/* Register Button */}
                <button className="register-button" onClick={handleRegister}>Register</button>

                {/* Back to Login Button */}
                <button className="backToLogin-button" onClick={handleBackToLogin}>Back to Login</button>
            </div>
        </div>
    );
}