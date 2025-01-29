import prisma from "../config/database.js";

export const getPollDetails = async (req, res) => {
    try {
      const poll = await prisma.poll.findUnique({
        where: { id: req.params.pollId },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true
            }
          },
          options: {
            include: {
              votes: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      name: true,
                      profileImage: true
                    }
                  }
                }
              },
              _count: {
                select: { votes: true }
              }
            }
          }
        }
      });
  
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
  
      // Calculate total votes
      const totalVotes = poll.options.reduce((sum, option) => sum + option._count.votes, 0);
  
      // Format response
      const formattedPoll = {
        ...poll,
        options: poll.options.map(option => ({
          id: option.id,
          text: option.text,
          votes: option._count.votes,
          percentage: totalVotes > 0 ? (option._count.votes / totalVotes) * 100 : 0,
          voters: option.votes.map(vote => vote.user)
        })),
        totalVotes,
        userVote: poll.options.find(option => 
          option.votes.some(vote => vote.user.id === req.user.id)
        )?.id || null
      };
  
      res.json(formattedPoll);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching poll details' });
    }
  }