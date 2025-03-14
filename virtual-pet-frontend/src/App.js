import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Navigation/Welcome';
import Login from './Components/Login';
import './Resources/Style/Welcome.css';
import Register from "./Components/Register";
import Workshop from "./Components/Workshop";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/workshop" element={<Workshop />} />
                </Routes>
            </div>
        </Router>
    );
}
export default App;