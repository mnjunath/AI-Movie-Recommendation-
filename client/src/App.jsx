import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <BrowserRouter>
            <div>
                {isAuthenticated && <Navbar onLogout={handleLogout} />}
                <Routes>
                    <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
                    <Route path='/movie/:id' element={isAuthenticated ? <MovieDetails /> : <Navigate to="/login" replace />} />


                    <Route path='/register' element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
                    <Route path='/login' element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App;