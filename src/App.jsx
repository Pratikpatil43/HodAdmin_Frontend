import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/AuthForm';
import Dashboard from './pages/Dashboard';
import Viewprofile from './components/Dashboard/HOD/Viewprofile';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthForm type="register" />} />
                <Route path="/login" element={<AuthForm type="login" />} />
                <Route path="/profile" element={<Viewprofile />} />
                {/* Dashboard with nested routes */}
                <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
