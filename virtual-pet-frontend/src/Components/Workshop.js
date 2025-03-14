import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Resources/Style/Workshop.css";
import menuIcon from "../Resources/Images/menuIcon.webp";
import tankImg from "../Resources/Images/Robos/tank.png";
import meleeImg from "../Resources/Images/Robos/melee.png";
import rangedImg from "../Resources/Images/Robos/ranged.png";
import wallpaper from '../Resources/Images/Backgrounds/BackgroundMain.webp';

export default function Workshop() {
    const [user, setUser] = useState(null);
    const [robots, setRobots] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos del usuario desde el almacenamiento local
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        if (!parsedUser) {
            navigate("/login");
        } else {
            setUser(parsedUser);
            fetchRobots(parsedUser);
        }
    }, [navigate]);

    const profileIcons = {
        defaultProfile: require("../Resources/Images/ProfileImages/profileIcon.png"),
        rangedProfile: require("../Resources/Images/ProfileImages/rangedProfile.png"),
        meleeProfile: require("../Resources/Images/ProfileImages/meleeProfile.png"),
        tankProfile: require("../Resources/Images/ProfileImages/tankProfile.png")
    };


    const fetchRobots = async (user) => {
        const endpoint = user.roleType === "ADMIN" ? "/robos/all" : `/robos/get/${user.id}`;
        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Robots API response:", data);
                if (data.robos && Array.isArray(data.robos)) {
                    setRobots(data.robos);
                } else {
                    setRobots([]);
                    console.error("Unexpected response format:", data);
                }
            } else {
                setRobots([]);
                console.error("Failed to fetch robots, response:", response.status);
            }
        } catch (error) {
            setRobots([]);
            console.error("Error fetching robots:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const getRobotImage = (type) => {
        if (!type) return meleeImg;
        const upperType = type.toUpperCase();
        switch (upperType) {
            case "TANK": return tankImg;
            case "MELEE": return meleeImg;
            case "RANGED": return rangedImg;
            default: return meleeImg;
        }
    };


    return (
        <div className="workshop-container" style={{ backgroundImage: `url(${wallpaper})` }}>
            {/* Header */}
            <header className="header">
                <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <img src={menuIcon} alt="Menu" className="menu-icon" />
                    {menuOpen && (
                        <ul className="menu-list">
                            <li onClick={() => navigate("/workshop")}>
                                Workshop
                            </li>
                            <li onClick={() => navigate("/battle-arena")}>
                                Battle Arena
                            </li>
                        </ul>
                    )}
                </div>
                <h1 className="project-title">Robofighters</h1>
                <h2 className="page-title">Workshop</h2>
                {user && (
                    <div className="user-info">
                        <span className="username">{user.username}</span>
                        <img src={profileIcons[user.profileImage] || profileIcons.defaultProfile} alt="Profile Icon" className="profile-icon" />
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </header>


            <div className="robot-section">
                {robots.length === 0 ? (
                    <button className="build-robo-button">Build Robo</button>
                ) : (
                    <>
                        <button className="build-robo-button">Build Robo</button>
                        <div className="robot-list">
                            {robots.map((robot) => (
                                <div key={robot.id} className="robot-card">
                                    <img src={getRobotImage(robot.type)} alt={robot.type} className="robot-image" />
                                    <h3>{robot.name}</h3>
                                    <p>Type: {robot.type}</p>
                                    <p>Stats:</p>
                                    <ul>
                                        <li>Health: {robot.health || 0}</li>
                                        <li>Attack: {robot.attack || 0}</li>
                                        <li>Defense: {robot.defense || 0}</li>
                                        <li>Speed: {robot.speed || 0}</li>
                                        <li>Happiness: {robot.happiness || 0}</li>
                                    </ul>


                                    <div className="robot-actions">
                                        <button className="rename-button">Rename</button>
                                        <button className="destroy-button">Destroy</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}