import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import your components (You will create these in your components folder)
import Navbar from './components/Navbar';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import UserDetails from './pages/UserDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="">
          <Routes>
            <Route path="/" element={<UserList />} />

            <Route path="/add" element={<UserForm />} />

            <Route path="/edit/:id" element={<UserForm />} />

            <Route path="/user/:id" element={<UserDetails />} />
            
            <Route path="*" element={<div className="text-center py-20">Page Not Found</div>} />
          </Routes>
        </main>

        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;