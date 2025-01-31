import prisma from '../config/database.js';

// Middleware to verify session token
export const authenticateToken = async (req, res, next) => {
  console.log("entered authenticateToken...")
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ error: 'No token provided' });
      const token = authHeader.split(' ')[1];
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true }
      });
  
      if (!session || new Date(session.expiresAt) < new Date()) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
  
      req.user = session.user;
      next();
    } catch (error) {
      console.error('Error authenticating user:', error);
      res.status(500).json({ error: 'Error authenticating user' });
    }
  };