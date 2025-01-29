import prisma from "../config/database.js";

export const getPostDetails = async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        where: { authorId: req.params.userId },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true
            }
          },
          category: true,
          _count: {
            select: { likes: true, comments: true }
          },
          likes: {
            select: {
              userId: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
  
      const formattedPosts = posts.map(post => ({
        ...post,
        isLiked: post.likes.some(like => like.userId === req.user.id),
        likes: post._count.likes,
        comments: post._count.comments
      }));
  
      res.json(formattedPosts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user posts' });
    }
  }