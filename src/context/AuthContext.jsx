import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials, userType) => {
    try {
      // For demonstration purposes, we'll skip the API call and simulate a successful login
      // In a real app, you would make an API call to validate credentials
      
      let userData;
      
      if (userType === 'student') {
        userData = {
          _id: '1',
          studentId: credentials.studentId || 'S001',
          name: 'John Doe',
          email: 'john@example.com',
          token: 'demo-token-student',
          userType: 'student'
        };
      } else {
        userData = {
          _id: '1',
          email: credentials.email || 'admin@example.com',
          name: 'Admin User',
          token: 'demo-token-admin',
          userType: 'admin'
        };
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.userType === 'admin',
    isStudent: user?.userType === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 