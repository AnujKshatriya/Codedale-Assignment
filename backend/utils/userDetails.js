import prisma from "../config/database.js";

export const getUserDetails = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          bio: true,
          profileImage: true,
          createdAt: true,
          _count: {
            select: {
              posts: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error in getUserDetails:', error);
      res.status(500).json({ error: 'Error fetching user details' });
    }
  }