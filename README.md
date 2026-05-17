# ROD-256 Secure Authentication System

A cloud-based secure authentication system built with a custom C++ hashing algorithm, RSA-signed JWT authentication, Supabase PostgreSQL, Render backend deployment, Vercel frontend deployment, SHA/RIPEMD comparison, and a blockchain-style audit ledger.

This project was developed as a System Programming project and demonstrates how low-level C++ logic can be connected to a modern full-stack cloud authentication system.

---

## Live Project

### Frontend

https://rod-256-auth-system.vercel.app/

### Backend

https://rod-256-auth-backend.onrender.com/

### Backend Health Check

https://rod-256-auth-backend.onrender.com/api/health

### GitHub Repository

https://github.com/RodinaAmrMukhtar/rod-256-auth-system

---

## Project Summary

ROD-256 Secure Authentication System is a full-stack cloud project that combines:

- A custom C++ object-oriented hashing algorithm called ROD-256
- A Node.js and Express.js backend
- A React and Vite frontend
- RSA-signed JWT authentication
- bcrypt password hashing
- Supabase PostgreSQL cloud database
- Render cloud backend deployment
- Vercel cloud frontend deployment
- SHA and RIPEMD hash comparison
- Blockchain-style audit ledger
- Live animated algorithm visualization

The goal of the project is to show how secure authentication can be designed using both standard cryptographic tools and a custom educational hashing algorithm.

---

## Main Features

- User registration
- User login
- bcrypt password hashing
- RSA-signed JWT token generation
- JWT verification using RSA public key
- Custom ROD-256 hashing algorithm
- C++ OOP hashing core
- Node.js backend calling compiled C++ CLI
- SHA family hash comparison
- RIPEMD-160 hash comparison
- Blockchain-style authentication audit ledger
- Ledger verification
- Supabase PostgreSQL cloud database
- Render backend deployment
- Vercel frontend deployment
- Live algorithm visualization page
- Coffee-themed glassy UI
- Light and dark theme support

---

## Tech Stack

### Frontend

- React
- Vite
- Bootstrap 5
- JavaScript
- CSS animations
- Glassmorphism UI
- Vercel

### Backend

- Node.js
- Express.js
- PostgreSQL
- Supabase
- Render
- bcryptjs
- jsonwebtoken
- pg

### Core System Programming Part

- C++
- Object-Oriented Programming
- Custom hashing logic
- Command-line interface bridge
- C++ executable called from Node.js

### Cloud Services

- Vercel for frontend hosting
- Render for backend hosting
- Supabase for PostgreSQL cloud database
- GitHub for version control and deployment source

---

## Cloud Architecture

```text
User Browser
    |
    v
React Frontend on Vercel
    |
    v
Node.js Backend on Render
    |
    +----------------------------+
    |                            |
    v                            v
C++ ROD-256 CLI Engine       Supabase PostgreSQL
    |                            |
    v                            v
Custom Hash Output          Users + Audit Ledger
    |
    v
Blockchain-style Ledger Hashing
```

---

## System Flow

```text
1. User opens the Vercel frontend.
2. User registers or logs in.
3. Frontend sends request to Render backend.
4. Backend validates data.
5. Passwords are hashed using bcrypt.
6. Login creates RSA-signed JWT token.
7. Authentication event is written to the audit ledger.
8. Ledger block is hashed using ROD-256.
9. Data is stored in Supabase PostgreSQL.
10. User can verify the ledger and test hash algorithms.
```

---

## Project Folder Structure

```text
rod-256-auth-system
|
|-- backend
|   |
|   |-- routes
|   |   |-- authRoutes.js
|   |   |-- cryptoRoutes.js
|   |   |-- ledgerRoutes.js
|   |
|   |-- services
|   |   |-- authService.js
|   |   |-- ledgerService.js
|   |
|   |-- utils
|   |   |-- db.js
|   |   |-- rod256Runner.js
|   |   |-- rsaJwt.js
|   |   |-- storage.js
|   |
|   |-- scripts
|   |   |-- buildRod256.js
|   |   |-- generateKeys.js
|   |
|   |-- server.js
|   |-- package.json
|   |-- nodemon.json
|   |-- .env.example
|
|-- frontend
|   |
|   |-- public
|   |   |-- favicon.png
|   |   |-- rod-coffee-bean.svg
|   |
|   |-- src
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- main.jsx
|   |   |-- index.css
|   |
|   |-- index.html
|   |-- package.json
|   |-- .env.example
|
|-- rod256-core
|   |
|   |-- rod256.hpp
|   |-- rod256.cpp
|   |-- rod256_cli.cpp
|   |-- main.cpp
|   |-- audit_block.hpp
|   |-- audit_block.cpp
|   |-- ledger_demo.cpp
|
|-- docs
|-- README.md
|-- .gitignore
```

---

## ROD-256 Algorithm

ROD-256 is the custom hashing algorithm created for this project.

It is written in C++ using object-oriented programming and produces a 256-bit hash output.

The digest is represented as 64 hexadecimal characters.

Since one hexadecimal character represents 4 bits:

```text
64 hex characters × 4 bits = 256 bits
```

Example:

```text
Message: password123
Salt: ABC987
```

ROD-256 output:

```text
fbd11d248c0f19adf7efab23ed0b92b8db8bff25c00b34afbfc1cf3843a8ea9d
```

---

## How ROD-256 Works

ROD-256 uses:

- Eight internal 32-bit state values
- Salt-based input variation
- 64 rounds of mixing
- XOR operations
- Bit rotations
- Modular addition
- Round constants
- Final hexadecimal digest generation

Simplified flow:

```text
message + salt
      |
      v
convert characters to byte values
      |
      v
initialize eight 32-bit states
      |
      v
perform 64 mixing rounds
      |
      v
combine final states
      |
      v
produce 256-bit digest
```

---

## ROD-256 Internal Round Concept

Inside each round, the algorithm mixes the current byte with the internal state.

Simplified version:

```text
mix = state[index] XOR value XOR roundConstant
mix = rotateLeft(mix, 7)
mix = mix + rotateRight(state[next], 11)
state[index] = state[index] XOR mix
```

This creates diffusion, meaning a small change in the input can affect the final digest.

---

## What Is a Digest?

A digest is the final output of a hash algorithm.

Example:

```text
message + salt -> hash algorithm -> digest
```

In this project:

```text
password123 + ABC987 -> ROD-256 -> fbd11d248c0f19ad...
```

The long hexadecimal value is the hash digest.

---

## C++ Core

The custom hashing algorithm is inside:

```text
rod256-core/rod256.hpp
rod256-core/rod256.cpp
```

The CLI bridge is inside:

```text
rod256-core/rod256_cli.cpp
```

The backend builds the C++ CLI using:

```bash
npm run build
```

The backend build script compiles the C++ source into a CLI executable that the Node.js backend can call.

---

## Node.js to C++ Bridge

The backend calls the C++ hashing engine using:

```text
backend/utils/rod256Runner.js
```

The backend passes:

```text
message
salt
```

to the C++ CLI and receives the ROD-256 hash output.

This connects system programming logic with a cloud-based backend API.

---

## Authentication System

The authentication system supports:

- Register
- Login
- RSA-signed JWT token generation
- JWT verification
- Password hashing
- Login event logging

---

## Password Security

Passwords are never stored directly.

The backend uses bcrypt to hash passwords before saving them.

Instead of storing this:

```text
123456
```

the database stores a bcrypt hash.

This protects user passwords if the database is inspected.

---

## RSA-Signed JWT

The backend uses RSA key pairs for JWT authentication.

The private key signs the token.

The public key verifies the token.

JWT algorithm:

```text
RS256
```

This means the system uses RSA with SHA-256 for token signing.

---

## Blockchain-style Audit Ledger

Each register or login event is stored as a ledger block.

Each block contains:

- Block index
- Username
- Event type
- Status
- IP address
- Timestamp
- Previous hash
- Current hash

The current hash is generated using ROD-256.

Because each block contains the previous hash, the blocks form a chain.

If a previous block changes, the verification fails.

---

## Ledger Verification

The ledger verification checks:

1. Whether every block points to the correct previous hash.
2. Whether every current hash still matches the block data.
3. Whether the chain was modified.

If everything is correct:

```text
Ledger status: VALID
```

If something was changed:

```text
Ledger status: INVALID
```

---

## Hash Algorithm Comparison

The system compares ROD-256 with standard hashing algorithms.

Supported algorithms:

- ROD-256
- SHA-1
- SHA-224
- SHA-256
- SHA-384
- SHA-512
- SHA3-256
- SHA3-512
- RIPEMD-160

This comparison is available through both the frontend and backend API.

---

## Frontend Pages

### Home Page

A glassy coffee-themed landing page presenting the project.

### Console Page

Includes:

- Register form
- Login form
- ROD-256 hash lab
- SHA and RIPEMD comparison
- Audit ledger viewer

### Algorithm Page

A live visual explanation of how ROD-256 works.

Includes:

- Message input
- Salt input
- Live hash generation
- Coffee bean animation
- Internal state cups
- Step-by-step explanation
- Hash comparison board

### Dashboard Page

After login, the user can view authenticated session information and ledger status.

---

## API Endpoints

### Health Check

```http
GET /api/health
```

Returns backend status.

Example response:

```json
{
  "status": "OK",
  "project": "Cloud-Based Secure Authentication System",
  "algorithm": "ROD-256",
  "ledger": "Blockchain-style audit ledger",
  "tokenSigning": "RSA RS256",
  "storage": "PostgreSQL"
}
```

---

### Register User

```http
POST /api/auth/register
```

Example body:

```json
{
  "username": "testuser",
  "email": "test@test.com",
  "password": "123456"
}
```

---

### Login User

```http
POST /api/auth/login
```

Example body:

```json
{
  "username": "testuser",
  "password": "123456"
}
```

Returns:

- Login result
- RSA-signed JWT token
- User data
- Ledger block

---

### Verify JWT Token

```http
POST /api/auth/verify-token
```

Example body:

```json
{
  "token": "jwt_token_here"
}
```

---

### Generate ROD-256 Hash

```http
POST /api/rod256/hash
```

Example body:

```json
{
  "message": "password123",
  "salt": "ABC987"
}
```

---

### Compare Hash Algorithms

```http
POST /api/crypto/compare
```

Example body:

```json
{
  "message": "password123",
  "salt": "ABC987"
}
```

---

### Get Audit Ledger

```http
GET /api/ledger
```

---

### Verify Audit Ledger

```http
GET /api/ledger/verify
```

---

## Database

The project uses Supabase PostgreSQL in cloud mode.

The backend automatically creates these tables:

```text
app_users
audit_ledger
```

### app_users Table

Stores:

- User ID
- Username
- Email
- Password hash
- Role
- Created date

### audit_ledger Table

Stores:

- Block ID
- Block index
- Username
- Event type
- Status
- IP address
- Timestamp
- Previous hash
- Current hash

---

## Local Storage Mode

If `DATABASE_URL` is not available, the backend falls back to local JSON storage.

Local storage file:

```text
backend/data/db.json
```

This makes the project easy to test locally.

---

## Cloud Storage Mode

If `DATABASE_URL` exists, the backend uses PostgreSQL.

This is how the deployed Render backend connects to Supabase.

---

## Environment Variables

### Backend Environment Variables

```env
PORT=4000
DATABASE_URL=your_supabase_postgresql_connection_string
RSA_PRIVATE_KEY=your_rsa_private_key
RSA_PUBLIC_KEY=your_rsa_public_key
NODE_VERSION=24.14.0
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:4000
```

For deployed frontend:

```env
VITE_API_URL=https://rod-256-auth-backend.onrender.com
```

---

## Local Setup

### Prerequisites

Install:

- Node.js
- npm
- g++
- Git

---

## Run Backend Locally

```bash
cd backend
npm install
npm run build
npm run dev
```

Backend runs at:

```text
http://localhost:4000
```

Test backend:

```text
http://localhost:4000/api/health
```

---

## Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Build ROD-256 CLI

From the backend folder:

```bash
npm run build
```

This compiles the C++ ROD-256 CLI.

On Windows it creates:

```text
backend/bin/rod256_cli.exe
```

On Linux cloud deployment it creates:

```text
backend/bin/rod256_cli
```

---

## Cloud Deployment

### Frontend Deployment

Frontend is deployed on Vercel.

Settings:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variable:

```text
VITE_API_URL=https://rod-256-auth-backend.onrender.com
```

---

### Backend Deployment

Backend is deployed on Render.

Settings:

```text
Runtime: Node
Root Directory: empty
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && npm start
```

The root directory is left empty because the backend build needs access to both:

```text
backend
rod256-core
```

---

### Database Deployment

Database is deployed on Supabase PostgreSQL.

The Supabase connection string is used as:

```text
DATABASE_URL
```

---

## Security Notes

This project is for educational and academic demonstration.

ROD-256 is a custom learning algorithm. It should not be used as a production replacement for standard cryptographic algorithms.

For real production systems, use reviewed and trusted algorithms such as:

- SHA-256
- SHA-3
- bcrypt
- Argon2
- PBKDF2

Custom cryptographic algorithms should be reviewed and tested by security experts before real-world use.

---

## What This Project Demonstrates

This project demonstrates:

- C++ system programming
- Object-oriented algorithm design
- Custom hash algorithm design
- Full-stack development
- Backend API development
- React frontend development
- Cloud deployment
- PostgreSQL cloud database usage
- RSA key-based authentication
- JWT token security
- Password hashing
- Blockchain-style data integrity
- Connecting compiled C++ with Node.js
- Hash algorithm comparison
- Live algorithm visualization

---

## Screenshots

Add screenshots inside:

```text
docs/screenshots
```

Suggested screenshots:

```text
docs/screenshots/home.png
docs/screenshots/algorithm.png
docs/screenshots/console.png
docs/screenshots/ledger.png
```

Example Markdown:

```markdown
![Home Page](docs/screenshots/home.png)
![Algorithm Page](docs/screenshots/algorithm.png)
![Console Page](docs/screenshots/console.png)
![Ledger Page](docs/screenshots/ledger.png)
```

---

## Future Improvements

Possible future improvements:

- Add admin dashboard
- Add user profile page
- Add email verification
- Add password reset
- Add rate limiting
- Add account lockout after failed attempts
- Add refresh tokens
- Add Docker support
- Add automated tests
- Add downloadable audit reports
- Add stronger avalanche-effect analysis
- Add charts for hash comparison

---

## Author

Rodina Amr Mukhtar

Computer Engineering Student  
Kastamonu University

---

## Project Status

```text
Local backend: complete
Local frontend: complete
ROD-256 C++ algorithm: complete
Node.js backend: complete
React frontend: complete
Supabase PostgreSQL: connected
Render backend: deployed
Vercel frontend: deployed
RSA JWT authentication: implemented
Blockchain-style audit ledger: implemented
SHA and RIPEMD comparison: implemented
Live algorithm visualization: implemented
```

---

## License

This project is created for educational purposes.
