# E-Voting System

A secure and user-friendly electronic voting system built with Node.js, Express, and modern web technologies.

## Features

- **User Authentication**

  - Secure registration and login system
  - Age verification (18+ requirement)
  - State-wise user registration
  - Gender-based user categorization

- **Voting System**

  - Multiple candidate support
  - One vote per user policy
  - Real-time vote counting
  - Secure vote submission

- **Results Management**

  - Real-time vote results display
  - Winner declaration
  - Tie handling
  - Detailed vote statistics

- **User Interface**

  - Modern and responsive design
  - Intuitive candidate selection
  - Easy-to-use dashboard
  - Mobile-friendly interface

- **Security Features**
  - Password hashing
  - JWT-based authentication
  - Secure session management
  - Vote integrity protection

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd <repository-name>
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node server.js
```

4. Open your browser and navigate to:

```
http://localhost:5000
```

## Project Structure

```
programFile/
├── data/
│   ├── users.json      # User data storage
│   └── votes.json      # Vote data storage
├── public/
│   ├── index.html      # Login/Registration page
│   ├── dashboard.html  # Voting dashboard
│   ├── index.css       # Main styles
│   ├── dashboard.css   # Dashboard styles
│   ├── index.js        # Frontend logic
│   └── dashboard.js    # Dashboard logic
└── server.js           # Backend server
```

## Dependencies

The project uses the following main dependencies:

- express
- bcrypt
- jsonwebtoken
- cors

These will be automatically installed when you run `npm install`.

## Security Notes

- The system uses bcrypt for password hashing
- JWT tokens for session management
- One vote per user policy is strictly enforced
- Age verification is required for registration

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
