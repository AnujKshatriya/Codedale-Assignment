import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authenticateToken } from "./middleware/authenticateToken.js";

import { getUserDetails } from "./utils/userDetails.js";
import { getPostDetails } from "./utils/postDetails.js";
import { getPollDetails } from "./utils/pollDetails.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 1. Get user details from session token
app.get('/api/user/details', authenticateToken, getUserDetails);

// 2. Get all posts by a user with likes
app.get('/api/user/:userId/posts', authenticateToken, getPostDetails);

// 3. Get complete poll details
app.get('/api/poll/:pollId', authenticateToken, getPollDetails);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

