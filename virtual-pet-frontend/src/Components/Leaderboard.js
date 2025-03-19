import React, { useEffect, useState } from "react";
                import { useNavigate } from "react-router-dom";
                import "../Resources/Style/Workshop.css";
                import "../Resources/Style/Leaderboard.css";
                import menuIcon from "../Resources/Images/menuIconv2.webp";
                import wallpaper from '../Resources/Images/Backgrounds/ArenaBackground.webp';

                export default function Leaderboard() {
                    const [user, setUser] = useState(null);
                    const [ranking, setRanking] = useState([]);
                    const [menuOpen, setMenuOpen] = useState(false);
                    const navigate = useNavigate();

                    useEffect(() => {
                        const storedUser = localStorage.getItem("user");
                        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

                        if (!parsedUser) {
                            navigate("/login");
                        } else {
                            setUser(parsedUser);
                            fetchRanking();
                        }
                    }, [navigate]);

                    const fetchRanking = async () => {
                        try {
                            const response = await fetch(`http://localhost:8080/auth/ranking`, {
                                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                            });
                            if (response.ok) {
                                const data = await response.json();
                                setRanking(data);
                            } else {
                                console.error("Failed to fetch ranking:", response.statusText);
                            }
                        } catch (error) {
                            console.error("Error fetching ranking:", error);
                        }
                    };

                    const handleLogout = () => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        navigate("/login");
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
                                <h2 className="page-title">Leaderboard</h2>
                                {user && (
                                    <div className="user-info">
                                        <div className="user-name-info">
                                            <span className="username">{user.username}</span>
                                            <span className="currency">Credits: {user.currency}</span>
                                        </div>
                                        <img src={require("../Resources/Images/ProfileImages/profileIcon.png")} alt="Profile Icon" className="profile-icon" />
                                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </header>

                            <div className="ranking-section">
                                <table className="ranking-table">
                                    <thead>
                                        <tr>
                                            <th>Position</th>
                                            <th>Username</th>
                                            <th>Wins</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ranking.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>{index + 1}</td>
                                                <td>{user.username}</td>
                                                <td>{user.wins}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }