import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../Utils/fetchUser";
import "../Resources/Style/Workshop.css";
import menuIcon from "../Resources/Images/menuIconv2.webp";
import tankImg from "../Resources/Images/Robos/tank.png";
import meleeImg from "../Resources/Images/Robos/melee.png";
import rangedImg from "../Resources/Images/Robos/ranged.png";
import wallpaper from '../Resources/Images/Backgrounds/BackgroundMain.webp';

export default function Workshop() {
    const [user, setUser] = useState(null);
    const [robots, setRobots] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [renameModal, setRenameModal] = useState({ open: false, robot: null });
    const [destroyModal, setDestroyModal] = useState({ open: false, robot: null });
    const [repairModal, setRepairModal] = useState({ open: false, robot: null });
    const [buildModal, setBuildModal] = useState({ open: false, type: null });
    const [newName, setNewName] = useState("");
    const navigate = useNavigate();
    const [insuficientCreditsModal, setInsuficientCreditsModal] = useState({ open: false, type: null });

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

    const profileIcons = {
        defaultProfile: require("../Resources/Images/ProfileImages/profileIcon.png"),
        rangedProfile: require("../Resources/Images/ProfileImages/rangedProfile.png"),
        meleeProfile: require("../Resources/Images/ProfileImages/meleeProfile.png"),
        tankProfile: require("../Resources/Images/ProfileImages/tankProfile.png")
    };

    const fetchRobots = async (user) => {
        const endpoint = user.roleType.toUpperCase() === "ADMIN" ? "/robos/all" : `/robos/get/${user.id}`;
        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.robos && Array.isArray(data.robos)) {
                    setRobots(data.robos);
                } else {
                    setRobots([]);
                }
            } else {
                setRobots([]);
            }
        } catch (error) {
            setRobots([]);
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

    const handleRename = async () => {
        try {
            const response = await fetch(`http://localhost:8080/robos/update?id=${renameModal.robot.id}&name=${newName}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                await fetchRobots(user);
                await fetchUser(setUser);
                setRenameModal({ open: false, robot: null });
            } else {
                console.error("Failed to rename robot:", response.statusText);
            }
        } catch (error) {
            console.error("Error renaming robot:", error);
        }
    };

    const handleDestroy = async () => {
        try {
            const response = await fetch(`http://localhost:8080/robos/destroy/${destroyModal.robot.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                await fetchRobots(user);
                await fetchUser(setUser);
                setDestroyModal({ open: false, robot: null });
            }
        } catch (error) {
            console.error("Error destroying robot:", error);
        }
    };

    const handleRepair = async () => {
        try {
            const response = await fetch(`http://localhost:8080/robos/repair/${repairModal.robot.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                await fetchRobots(user);
                await fetchUser(setUser);
                setRepairModal({ open: false, robot: null });
            } else {
                console.error("Failed to repair robot:", response.statusText);
            }
        } catch (error) {
            console.error("Error repairing robot:", error);
        }
    };

    const handleBuild = async () => {
        try {
            const response = await fetch(`http://localhost:8080/robos/build`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name: newName, type: buildModal.type.toLowerCase(), userId: user.id })
            });
            if (response.ok) {
                await fetchUser(setUser);
                await fetchRobots(user);
                setBuildModal({ open: false, type: null });
            } else {
                const errorMessage = await response.text();
                if (errorMessage === "Insufficient Credits") {
                    setInsuficientCreditsModal({ open: true, type: null });
                } else {
                    console.error("Failed to build robot:", errorMessage);
                }
            }
        } catch (error) {
            console.error("Error building robot:", error);
        }
    };

    const handleMenuNavigation = (path) => {
        navigate(path);
        fetchUser(setUser);
    };

    return (
        <div className="workshop-container" style={{ backgroundImage: `url(${wallpaper})` }}>
            <header className="header">
                <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <img src={menuIcon} alt="Menu" className="menu-icon" />
                    {menuOpen && (
                        <ul className="menu-list">
                            <li onClick={() => handleMenuNavigation("/workshop")}>
                                Workshop
                            </li>
                            <li onClick={() => handleMenuNavigation("/battlearena")}>
                                Battle Arena
                            </li>
                            <li onClick={() => handleMenuNavigation("/leaderboard")}>
                                Leaderboard
                            </li>
                            <li onClick={() => handleMenuNavigation("/upgradeshop")}>Upgrade Shop</li>
                        </ul>
                    )}
                </div>
                <h1 className="project-title">Robofighters</h1>
                <h2 className="page-title">Workshop</h2>
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
                    <button className="build-robo-button" onClick={() => setBuildModal({ open: true, type: null })}>Build Robo</button>
                ) : (
                    <>
                        <button className="build-robo-button" onClick={() => setBuildModal({ open: true, type: null })}>Build Robo</button>
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
                                        <button className="rename-button" onClick={() => setRenameModal({ open: true, robot })}>Rename</button>
                                        <button className="repair-button" onClick={() => setRepairModal({ open: true, robot })}>Repair</button>
                                        <button className="destroy-button" onClick={() => setDestroyModal({ open: true, robot })}>Destroy</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {renameModal.open && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Rename Robot</h3>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="New Name"
                        />
                        <button className="rename-button" onClick={handleRename}>Accept</button>
                        <button className="destroy-button" onClick={() => setRenameModal({ open: false, robot: null })}>Cancel</button>
                    </div>
                </div>
            )}

            {destroyModal.open && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Are you sure?</h3>
                        <button className="rename-button" onClick={handleDestroy}>Accept</button>
                        <button className="destroy-button" onClick={() => setDestroyModal({ open: false, robot: null })}>Cancel</button>
                    </div>
                </div>
            )}

            {repairModal.open && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Repair Robot</h3>
                        <button className="rename-button" onClick={handleRepair}>Accept</button>
                        <button className="destroy-button" onClick={() => setRepairModal({ open: false, robot: null })}>Cancel</button>
                    </div>
                </div>
            )}

            {buildModal.open && !buildModal.type && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Select Robot Type</h3>
                        <div className="robot-selection">
                            <div className="robot-card" onClick={() => setBuildModal({ open: true, type: "TANK" })}>
                                <img src={tankImg} alt="Tank" className="robot-image" />
                                <h3>TANK</h3>
                                <p>Strong and durable, perfect for defense.</p>
                                <button className="rename-button">Select</button>
                            </div>
                            <div className="robot-card" onClick={() => setBuildModal({ open: true, type: "MELEE" })}>
                                <img src={meleeImg} alt="Melee" className="robot-image" />
                                <h3>MELEE</h3>
                                <p>Quick and agile, excels in close combat.</p>
                                <button className="rename-button">Select</button>
                            </div>
                            <div className="robot-card" onClick={() => setBuildModal({ open: true, type: "RANGED" })}>
                                <img src={rangedImg} alt="Ranged" className="robot-image" />
                                <h3>RANGED</h3>
                                <p>Expert in long-range attacks, keeps enemies at bay.</p>
                                <button className="rename-button">Select</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {buildModal.open && buildModal.type && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Build {buildModal.type} Robot</h3>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Robot Name"
                        />
                        <button className="rename-button" onClick={handleBuild}>Build</button>
                        <button className="destroy-button" onClick={() => setBuildModal({ open: false, type: null })}>Cancel</button>
                    </div>
                </div>
            )}
            {insuficientCreditsModal.open && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Insufficient Credits</h3>
                        <p>You do not have enough credits to build a new robo.</p>
                        <button className="rename-button" onClick={() => setInsuficientCreditsModal({ open: false, type: null })}>Accept</button>
                    </div>
                </div>
            )}
        </div>
    );
}