import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../Utils/fetchUser";
import "../Resources/Style/Workshop.css";
import "../Resources/Style/Upgradeshop.css";
import menuIcon from "../Resources/Images/menuIconv2.webp";
import tankImg from "../Resources/Images/Robos/tank.png";
import meleeImg from "../Resources/Images/Robos/melee.png";
import rangedImg from "../Resources/Images/Robos/ranged.png";
import wallpaper from '../Resources/Images/Backgrounds/RepairStation.webp';

export default function Upgradeshop() {
    const [user, setUser] = useState(null);
    const [robots, setRobots] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedRobot, setSelectedRobot] = useState(null);
    const [upgradeCost, setUpgradeCost] = useState(0);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        if (!parsedUser) {
            navigate("/login");
        } else {
            setUser(parsedUser);
            fetchRobots(parsedUser);
        }
    }, [navigate]);

    useEffect(() => {
        if (user) {
            fetchUser(setUser);
        }
    }, [user]);

    const fetchRobots = async (user) => {
        const endpoint = user.roleType.toUpperCase() === "ADMIN" ? "/robos/all" : `/robos/get/${user.id}`;
        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRobots(data.robos || []);
            } else {
                setRobots([]);
            }
        } catch (error) {
            setRobots([]);
        }
    };

    const fetchUpgradeCost = async (robotId) => {
        try {
            const response = await fetch(`http://localhost:8080/robos/${robotId}/upgrade-cost`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.ok) {
                const cost = await response.json();
                setUpgradeCost(cost);
            } else {
                setUpgradeCost(0);
            }
        } catch (error) {
            setUpgradeCost(0);
        }
    };

    const handleSelectRobot = (robot) => {
        setSelectedRobot(robot);
        fetchUpgradeCost(robot.id);
    };

    const handleUpgrade = async () => {
        if (user.currency < upgradeCost) {
            setMessage("Insufficient credits");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/robos/${selectedRobot.id}/upgrade`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.ok) {
                setMessage("Robo upgraded successfully");
                const updatedUser = { ...user, currency: user.currency - upgradeCost };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                await fetchRobots(updatedUser);
                setSelectedRobot(null);
            } else {
                setMessage("Upgrade failed");
            }
        } catch (error) {
            setMessage("Upgrade failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const profileIcons = {
        defaultProfile: require("../Resources/Images/ProfileImages/profileIcon.png"),
        rangedProfile: require("../Resources/Images/ProfileImages/rangedProfile.png"),
        meleeProfile: require("../Resources/Images/ProfileImages/meleeProfile.png"),
        tankProfile: require("../Resources/Images/ProfileImages/tankProfile.png")
    };

    const getRobotImage = (type) => {
        if (!type) return meleeImg;
        switch (type.toUpperCase()) {
            case "TANK": return tankImg;
            case "MELEE": return meleeImg;
            case "RANGED": return rangedImg;
            default: return meleeImg;
        }
    };

    return (
        <div className="workshop-container" style={{ backgroundImage: `url(${wallpaper})` }}>
            <header className="header">
                <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <img src={menuIcon} alt="Menu" className="menu-icon" />
                    {menuOpen && (
                        <ul className="menu-list">
                            <li onClick={() => navigate("/workshop")}>Workshop</li>
                            <li onClick={() => navigate("/battlearena")}>Battle Arena</li>
                            <li onClick={() => navigate("/leaderboard")}>Leaderboard</li>
                            <li onClick={() => navigate("/upgradeshop")}>Upgrade Shop</li>
                        </ul>
                    )}
                </div>
                <h1 className="project-title">Robofighters</h1>
                <h2 className="page-title">Upgrade Shop</h2>
                {user && (
                    <div className="user-info">
                        <div className="user-name-info">
                            <span className="username">{user.username}</span>
                            <span className="currency">Credits: {user.currency}</span>
                        </div>
                        <img src={profileIcons[user.profileImage] || profileIcons.defaultProfile} alt="Profile Icon" className="profile-icon" />
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </header>

            <div className="robot-section">
                {robots.length === 0 ? (
                    <p>No robots available.</p>
                ) : (
                    <div className="robot-list">
                        {robots.map((robot) => (
                            <div key={robot.id} className="robot-card">
                                <img src={getRobotImage(robot.type)} alt={robot.type} className="robot-image" />
                                <h3>{robot.name}</h3>
                                <p>Level: {robot.level}</p>
                                <p>Type: {robot.type}</p>
                                <p>Stats:</p>
                                <ul>
                                    <li>Health: {robot.health || 0}</li>
                                    <li>Attack: {robot.attack || 0}</li>
                                    <li>Defense: {robot.defense || 0}</li>
                                    <li>Speed: {robot.speed || 0}</li>
                                </ul>
                                <div className="robot-actions">
                                    <button className="select-button" onClick={() => handleSelectRobot(robot)}>Select</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedRobot && (
                <div className="battle-modal">
                    <div className="battle-robot-card">
                        <img src={getRobotImage(selectedRobot.type)} alt={selectedRobot.type} className="robot-image" />
                        <h3>{selectedRobot.name}</h3>
                        <p>Type: {selectedRobot.type}</p>
                        <p>Stats:</p>
                        <ul>
                            <li>Health: {selectedRobot.health}</li>
                            <li>Attack: {selectedRobot.attack}</li>
                            <li>Defense: {selectedRobot.defense}</li>
                            <li>Speed: {selectedRobot.speed}</li>
                        </ul>
                        <p>Upgrade cost: {upgradeCost}</p>
                        <div className="robot-actions">
                            <button className="upgrade-button" onClick={handleUpgrade}>Upgrade</button>
                            <button className="cancel-button" onClick={() => setSelectedRobot(null)}>Cancel</button>
                        </div>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}