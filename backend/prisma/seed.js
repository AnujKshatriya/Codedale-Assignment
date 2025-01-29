import prisma from '../config/database.js';
import bcrypt from 'bcrypt';

async function main() {
  // Clear existing data
  await prisma.pollVote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Career Guidance', description: 'Career related discussions' },
      { name: 'Resources', description: 'Learning resources' },
      { name: 'Hiring', description: 'Job opportunities' },
      { name: 'Tech News', description: 'Latest in technology' }
    ]
  });

  // Create users
  const password = await bcrypt.hash('password123', 10);
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'john@example.com',
        username: 'john_doe',
        password,
        name: 'John Doe',
        bio: 'Software Engineer',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      {
        email: 'jane@example.com',
        username: 'jane_smith',
        password,
        name: 'Jane Smith',
        bio: 'UX Designer',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      }
    ]
  });

  // Get created users and categories for reference
  const [user1, user2] = await prisma.user.findMany();
  const [category1, category2] = await prisma.category.findMany();

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Looking for software engineering resources. Any recommendations?',
      authorId: user1.id,
      categoryId: category1.id,
      comments: {
        create: {
          content: 'Check out freeCodeCamp!',
          authorId: user2.id
        }
      },
      likes: {
        create: {
          userId: user2.id
        }
      }
    }
  });

  // Create a poll
  const poll = await prisma.poll.create({
    data: {
      question: 'What programming language should I learn first?',
      creatorId: user1.id,
      options: {
        create: [
          { text: 'JavaScript' },
          { text: 'Python' },
          { text: 'Java' },
          { text: 'C++' }
        ]
      }
    }
  });

  // Add some votes to the poll
  const pollOptions = await prisma.pollOption.findMany({
    where: { pollId: poll.id }
  });

  await prisma.pollVote.create({
    data: {
      userId: user2.id,
      pollId: poll.id,
      optionId: pollOptions[0].id // Vote for JavaScript
    }
  });

  // Create session for testing
  await prisma.session.create({
    data: {
      userId: user1.id,
      token: 'test-session-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000 * 30 * 2) // 60 days from now
    }
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 