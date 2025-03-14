import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Resources/Style/Login.css';
import wallpaperWellcome from '../Resources/Images/optimized_background_4k.gif';

function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Lógica para manejar el login
        console.log("Login realizado");
    };

    const handleRegisterRedirect = () => {
        navigate('/register'); // Redirigir a la pantalla de registro
    };

    return (
        <div className="login-screen" style={{ backgroundImage: `url(${wallpaperWellcome})` }}>
            <div className="login-container">
                <h1>Login</h1>
                <div className="input-group">
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                </div>
                <button onClick={handleLogin}>Login</button>
                <p className="register-link" onClick={handleRegisterRedirect}>
                    No Account?  <span>Register</span>
                </p>
            </div>
        </div>
    );
}

export default Login;