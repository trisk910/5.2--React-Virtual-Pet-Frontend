import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Resources/Style/Login.css';
import wallpaper from '../Resources/Images/Backgrounds/BackgroundMain.webp';

function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful", data);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user)); // Guardamos el usuario correctamente
                navigate('/workshop');
            } else {
                setErrorMessage("Invalid credentials");
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again.");
            console.error("Network error:", error);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-screen" style={{ backgroundImage: `url(${wallpaper})` }}>
            <div className="login-container">
                <h1>Login</h1>
                <div className="input-group">
                    <input type="text" placeholder="Username" name="username" onChange={handleInputChange} />
                    <input type="password" placeholder="Password" name="password" onChange={handleInputChange} />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button onClick={handleLogin}>Login</button>
                <p className="register-link" onClick={handleRegisterRedirect}>
                    No Account?  <span>Register</span>
                </p>
            </div>
        </div>
    );
}

export default Login;
