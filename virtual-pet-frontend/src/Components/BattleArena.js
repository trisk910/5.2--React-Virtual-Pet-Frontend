import React, { useEffect, useState } from "react";
            import { useNavigate } from "react-router-dom";
            import "../Resources/Style/Workshop.css";
            import "../Resources/Style/BattleArena.css";
            import menuIcon from "../Resources/Images/menuIconv2.webp";
            import tankImg from "../Resources/Images/Robos/tank.png";
            import meleeImg from "../Resources/Images/Robos/melee.png";
            import rangedImg from "../Resources/Images/Robos/ranged.png";
            import unknownImg from "../Resources/Images/Robos/unknowRival.webp";
            import wallpaper from '../Resources/Images/Backgrounds/ArenaBackground.webp';

            export default function BattleArena() {
                const [user, setUser] = useState(null);
                const [robots, setRobots] = useState([]);
                const [menuOpen, setMenuOpen] = useState(false);
                const [selectedRobot, setSelectedRobot] = useState(null);
                const [rivalRobot, setRivalRobot] = useState(null);
                const [displayedLog, setDisplayedLog] = useState([]);
                const [isFighting, setIsFighting] = useState(false);
                const [fightCompleted, setFightCompleted] = useState(false);
                const [showReturnButton, setShowReturnButton] = useState(false);
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

                const fetchUser = async () => {
                    try {
                        const response = await fetch(`http://localhost:8080/auth/${user.id}`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                        });
                        if (response.ok) {
                            const updatedUser = await response.json();
                            setUser(updatedUser);
                            localStorage.setItem("user", JSON.stringify(updatedUser));
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
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

                const handleFight = async () => {
                    setIsFighting(true);
                    setFightCompleted(false);
                    setDisplayedLog([]);
                    setShowReturnButton(false);
                    const allRobots = await fetchAllRobots();
                    const availableRobots = allRobots.filter(robot => robot.userId !== user.id);
                    let randomIndex = Math.floor(Math.random() * availableRobots.length);
                    let selectedRival = availableRobots[randomIndex];

                    const fightResult = await simulateFight(selectedRobot.id, selectedRival.id);
                    setRivalRobot(selectedRival);
                    setIsFighting(false);
                    setFightCompleted(true);

                    let logIndex = 0;
                    const interval = setInterval(() => {
                        setDisplayedLog(prevLog => [...prevLog, fightResult.combatLog[logIndex]]);
                        logIndex++;
                        if (logIndex >= fightResult.combatLog.length) {
                            clearInterval(interval);
                            setShowReturnButton(true);
                            fetchUser(); // Fetch updated user data after the fight
                        }
                    }, 1000);
                };

                const fetchAllRobots = async () => {
                    try {
                        const response = await fetch(`http://localhost:8080/robos/all`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            return data.robos || [];
                        } else {
                            return [];
                        }
                    } catch (error) {
                        return [];
                    }
                };

                const simulateFight = async (robo1Id, robo2Id) => {
                    try {
                        const response = await fetch(`http://localhost:8080/fights/fight`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                            },
                            body: JSON.stringify({ robo1Id, robo2Id })
                        });
                        if (response.ok) {
                            return await response.json();
                        } else {
                            return { combatLog: [] };
                        }
                    } catch (error) {
                        return { combatLog: [] };
                    }
                };

                const resetFight = () => {
                    setSelectedRobot(null);
                    setRivalRobot(null);
                    setDisplayedLog([]);
                    setFightCompleted(false);
                    setShowReturnButton(false);
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
                                        <li onClick={() => navigate("/leaderboard")}>
                                            Leaderboard
                                        </li>
                                    </ul>
                                )}
                            </div>
                            <h1 className="project-title">Robofighters</h1>
                            <h2 className="page-title">Battle Arena</h2>
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
                                            <p>Type: {robot.type}</p>
                                            <p>Stats:</p>
                                            <ul>
                                                <li>Health: {robot.health || 0}</li>
                                                <li>Attack: {robot.attack || 0}</li>
                                                <li>Defense: {robot.defense || 0}</li>
                                                <li>Speed: {robot.speed || 0}</li>
                                            </ul>
                                            <div className="robot-actions">
                                                <button className="select-button" onClick={() => setSelectedRobot(robot)}>Select</button>
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
                                </div>
                                <div className="battle-controls">
                                    {!isFighting && !fightCompleted && (
                                        <>
                                            <button className="fight-button" onClick={handleFight}>Fight</button>
                                            <button className="cancel-button" onClick={resetFight}>Cancel</button>
                                        </>
                                    )}
                                    {fightCompleted && (
                                        <div className="combat-log">
                                            <h3>Combat Log</h3>
                                            <ul>
                                                {displayedLog.map((log, index) => (
                                                    <li key={index}>{log}</li>
                                                ))}
                                            </ul>
                                            {showReturnButton && (
                                                <div className="robot-actions">
                                                    <button className="return-button" onClick={resetFight}>Return</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="battle-robot-card">
                                    {rivalRobot ? (
                                        <>
                                            <img src={getRobotImage(rivalRobot.type)} alt={rivalRobot.type} className="robot-image" />
                                            <h3>{rivalRobot.name}</h3>
                                            <p>Type: {rivalRobot.type}</p>
                                            <p>Stats:</p>
                                            <ul>
                                                <li>Health: {rivalRobot.health}</li>
                                                <li>Attack: {rivalRobot.attack}</li>
                                                <li>Defense: {rivalRobot.defense}</li>
                                                <li>Speed: {rivalRobot.speed}</li>
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <img src={unknownImg} alt="Unknown" className="robot-image" />
                                            <h3>?</h3>
                                            <p>Type: ?</p>
                                            <p>Stats:</p>
                                            <ul>
                                                <li>Health: ?</li>
                                                <li>Attack: ?</li>
                                                <li>Defense: ?</li>
                                                <li>Speed: ?</li>
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            }