import express from 'express';

// POST /api/auth/logout - Logout user
export const logout = async (req, res) => {
  try {
    // In a stateless API, logout is mainly handled on the client side
    // We can clear any server-side sessions if needed
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Server error' });
  }
};