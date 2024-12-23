import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import { Box, Toolbar } from '@mui/material';
import AddFaculty from '../components/Dashboard/FacultyHandler/AddFacultyForm';
import FetchFaculty from '../components/Dashboard/FacultyHandler/Fetchfaculty';




const Dashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar Navigation */}
            <Sidebar />
            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f9f9f9',
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Routes>

                    <Route path="add-faculty" element={<AddFaculty />} />
                    <Route path="fetch-faculty" element={<FetchFaculty />} />

                </Routes>
            </Box>
        </Box>
    );
};

export default Dashboard;
