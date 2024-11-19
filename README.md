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

## Getting Started with Docker for Development

This guide will help you set up the development environment for our MERN app using Docker. Follow these steps to ensure a consistent environment across the team.

### Prerequisites
1. **Install Docker**  
   Ensure Docker Desktop (or Docker Engine for Linux) is installed on your machine:
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. Checkout a branch with dockerfiles (`feature/add-docker` is a test branch for now)
3. Build the docker image (only need for the first time, and if you made changes to docker related files)
    - `docker compose up -d --build` 
    - you should now see the following
    - ![alt text](./img/image.png)
    - click on the link 5173:5173 to open the app
4. Start docker image (regular use)
    - click on the first start arrow
    - ![alt text](./img/image2.png)
    - click on the link 5173:5173 to open the app
5. Stop docker image (regular use)
    - click on the stop button

## Dataset Used
@article{collins2022abo,
  title={ABO: Dataset and Benchmarks for Real-World 3D Object Understanding},
  author={Collins, Jasmine and Goel, Shubham and Deng, Kenan and Luthra, Achleshwar and
          Xu, Leon and Gundogdu, Erhan and Zhang, Xi and Yago Vicente, Tomas F and
          Dideriksen, Thomas and Arora, Himanshu and Guillaumin, Matthieu and
          Malik, Jitendra},
  journal={CVPR},
  year={2022}
}