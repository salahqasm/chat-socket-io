import express from 'express';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;
const secretKey = 'testSecretKey'; // You should change this to a secure key in a real application


app.use(express.json());

// Dummy user
const users = [
  {
    username: 'salah',
    password: '12345',
    role: "admin"
  }, {
    username: 'noor',
    password: '12345',
    role: "user"
  }
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find(user => user.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // User authenticated, generate JWT token
  const token = jwt.sign({ username: user.username, role: "admin" }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

interface IAuthReq extends Request {
  user?: any
}
// Middleware to authenticate JWT token
const authenticateToken = (req: IAuthReq, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = {
      user,
      role: "admin"
    };
    next();
  });
};

// Protected route example
app.get('/protected', authenticateToken, (req: IAuthReq, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
