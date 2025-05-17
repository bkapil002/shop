import { X, CircleUser, ShoppingBag, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useState } from 'react';
import './SideBar.css'; // Import the CSS file

const SideBar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/user/logOut", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        logout();
        onClose();
        alert('Logged out successfully');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`Logout failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <div
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2 className="sidebar-title">My Account</h2>
            <button onClick={onClose} className="sidebar-close-button">
              <X className="sidebar-close-icon" />
            </button>
          </div>

          {user ? (
            <div className="sidebar-user-info">
              <p className="sidebar-welcome-text">Welcome,</p>
              <p className="sidebar-user-email">{user.email}</p>
            </div>
          ) : (
            <div className="sidebar-guest-info">
              <p className="sidebar-login-prompt">Please log in to access your account.</p>
            </div>
          )}

          <div className="sidebar-links">
            <Link
              to="/profile"
              className="sidebar-link"
              onClick={onClose}
            >
              <CircleUser className="sidebar-link-icon" />
              <span>Personal Details</span>
            </Link>

            <Link
              to="/orders"
              className="sidebar-link"
              onClick={onClose}
            >
              <ShoppingBag className="sidebar-link-icon" />
              <span>My Orders</span>
            </Link>

            <button
              onClick={handleLogout}
              className="sidebar-logout-button"
            >
              {loading ? 'Wait...' : <><LogOut className="sidebar-link-icon" /><span>Log Out</span></>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
