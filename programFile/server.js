const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Create users.json if it doesn't exist
const usersFile = path.join(DATA_DIR, "users.json");
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
}

// Create votes.json if it doesn't exist
const votesFile = path.join(DATA_DIR, "votes.json");
if (!fs.existsSync(votesFile)) {
  fs.writeFileSync(votesFile, JSON.stringify({ votes: {} }, null, 2));
}

// Function to read users from file
function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data).users;
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
}

// Function to write users to file
function writeUsers(users) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify({ users }, null, 2));
  } catch (error) {
    console.error("Error writing users file:", error);
  }
}

// Function to read votes from file
function readVotes() {
  try {
    const data = fs.readFileSync(votesFile, "utf8");
    return JSON.parse(data).votes;
  } catch (error) {
    console.error("Error reading votes file:", error);
    return {};
  }
}

// Function to write votes to file
function writeVotes(votes) {
  try {
    fs.writeFileSync(votesFile, JSON.stringify({ votes }, null, 2));
  } catch (error) {
    console.error("Error writing votes file:", error);
  }
}

// Initialize votes for each candidate if not exists
function initializeVotes() {
  const votes = readVotes();
  const candidates = [1, 2, 3, 4];
  let changed = false;

  candidates.forEach((id) => {
    if (!votes[id]) {
      votes[id] = 0;
      changed = true;
    }
  });

  if (changed) {
    writeVotes(votes);
  }
}

// Initialize votes on server start
initializeVotes();

// JWT secret key (should be in environment variables in production)
const JWT_SECRET = "your-secret-key";

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Protected dashboard data route
app.get("/api/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Access granted to dashboard" });
});

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, ageVerified, gender, state } = req.body;
    console.log("Signup request received:", {
      name,
      email,
      ageVerified,
      gender,
      state,
    });

    // Validate required fields
    if (!name || !email || !password || !ageVerified || !gender || !state) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Read current users
    const users = readUsers();

    // Check if user already exists (case-insensitive)
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      ageVerified,
      gender,
      state,
    };

    // Add user and save to file
    users.push(newUser);
    writeUsers(users);

    console.log("New user created:", { id: newUser.id, email: newUser.email });
    console.log(
      "Current users:",
      users.map((u) => u.email)
    );

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    // Read current users
    const users = readUsers();
    console.log(
      "Current users:",
      users.map((u) => u.email)
    );

    // Find user (case-insensitive)
    const user = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Login successful for user:", email);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check if user has voted
app.get("/api/check-vote", authenticateToken, (req, res) => {
  try {
    const votes = readVotes();
    const userId = req.user.userId;
    const hasVoted = votes.userVotes && votes.userVotes[userId];
    res.json({ hasVoted: !!hasVoted });
  } catch (error) {
    console.error("Error checking vote status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Submit vote endpoint
app.post("/api/vote", authenticateToken, (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user.userId;
    const votes = readVotes();

    // Initialize userVotes if it doesn't exist
    if (!votes.userVotes) {
      votes.userVotes = {};
    }

    // Check if user has already voted
    if (votes.userVotes[userId]) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Initialize candidate vote count if it doesn't exist
    if (!votes[candidateId]) {
      votes[candidateId] = 0;
    }

    // Record the vote
    votes[candidateId]++;
    votes.userVotes[userId] = candidateId;

    // Save votes
    writeVotes(votes);

    res.json({ message: "Vote submitted successfully" });
  } catch (error) {
    console.error("Vote submission error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get vote results endpoint
app.get("/api/votes", async (req, res) => {
  try {
    const votes = readVotes();
    const results = {
      1: votes[1] || 0,
      2: votes[2] || 0,
      3: votes[3] || 0,
      4: votes[4] || 0,
    };

    res.json({ results });
  } catch (error) {
    console.error("Error getting vote results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Click here to open: http://localhost:${PORT}`
  );
});
