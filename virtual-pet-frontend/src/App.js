import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Navigation/Welcome';
import Login from './Navigation/Login';
import './Resources/Style/Welcome.css';
import Register from "./Navigation/Register";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}
export default App;