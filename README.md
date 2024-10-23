# E-Commerce System

This is a simple e-commerce application built using the MERN stack (MongoDB, Express.js, React, and Node.js). The backend is built using Node.js with Express, and the frontend is built using Vite (React).

## Features


## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MongoDB**: Make sure you have MongoDB installed locally or you have access to MongoDB Atlas. [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/E-Commerce-System.git
cd E-Commerce-System
```
### 2. Backend Setup
Navigate to the backend directory
- `cd server`

Install dependencies
- `npm install`
Setup environment variables
- create `.env` file in the server directory
- add `MONGO_URI=your-mongodb-connection-string`
    - replace password placeholder with your passsword   

Start backend server
- `npm run dev`
### 3. Frontend Setup
- `cd ../client`

Install all dependencies
- `npm install`

Set up proxy for API requests
- Open the `vite.config.js` file in the client directory
- ensure the file is as follows:
    ```
    export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
        '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
        },
        },
    },
    });
    ```
Start frontend dev server
- `npm run dev`

Follow local link to test app