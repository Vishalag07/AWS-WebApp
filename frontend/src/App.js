import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddUser from './pages/AddUser';
import Users from './pages/Users';
import Docs from './pages/Docs';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<AddUser />} />
            <Route path="/users" element={<Users />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

