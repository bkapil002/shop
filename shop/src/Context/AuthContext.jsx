import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchCart(userData.token); // Fetch cart data after login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
  };

  const updateUserProfile = (profileData) => {
    setUser((prevUser) => ({ ...prevUser, ...profileData }));
  };

  const fetchCart = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCart(response.data.products || []); // Ensure cart is an array
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      fetchCart(userData.token); // Fetch cart data on initial load
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      cart,
      login,
      logout,
      updateUserProfile,
      updateCart
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
