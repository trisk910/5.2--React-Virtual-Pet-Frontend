import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Resources/Style/Header.css";
import menuIcon from "../Resources/Images/menuIcon.png"; // Ícono de hamburguesa
import profileIcons from "../Resources/Images/ProfileImages"; // Objeto con imágenes de perfil

export default function Header({ username, profileImage, currentScreen }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="header-container">
            <div className="menu-section">
                <img src={menuIcon} alt="Menu" className="menu-icon" onClick={toggleMenu} />
                <span className="project-name">Robofighters</span>
            </div>
            <div className="screen-name">{currentScreen}</div>
            <div className="user-section">
                <span className="username">{username}</span>
                <img src={profileIcons[profileImage]} alt="Profile" className="profile-icon" />
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            {menuOpen && (
                <nav className="dropdown-menu">
                    <ul>
                        <li onClick={() => navigate("/workshop")}>Workshop</li>
                        <li onClick={() => navigate("/battle-arena")}>Battle Arena</li>
                    </ul>
                </nav>
            )}
        </header>
    );
}