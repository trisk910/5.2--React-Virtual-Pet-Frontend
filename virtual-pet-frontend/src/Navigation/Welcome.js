import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Resources/Style/Welcome.css';
import wallpaperWellcome from '../Resources/Images/Backgrounds/BackgroundMain.webp';

function Welcome() {
    const navigate = useNavigate();
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        const images = [
            `url(${wallpaperWellcome})`
        ];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        setBackgroundImage(randomImage);
    }, []);

    const handleEnter = () => {
        navigate('/login');
    };

    return (
        <div className="welcome-screen" style={{ backgroundImage }}>
            <div className="welcome-message">
                <h1>Welcome Robofighter</h1>
                <button onClick={handleEnter}>Enter</button>
            </div>
        </div>
    );
}

export default Welcome;