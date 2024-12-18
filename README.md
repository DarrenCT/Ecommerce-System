# E-Commerce System

This is a simple e-commerce application built using the MERN stack (MongoDB, Express.js, React, and Node.js). The backend is built using Node.js with Express, and the frontend is built using Vite (React).

## Features


# Step-by-Step Guide to Run the E-Commerce Project Docker Images Locally
**Install Docker**  
   Ensure Docker Desktop (or Docker Engine for Linux) is installed on your machine:
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

## 1. Pull Docker Images
Ensure the backend and frontend images are pulled from Docker Hub:
```
docker pull darrenct/ecommerce-backend:latest
docker pull darrenct/ecommerce-frontend:latest
```
## 2. Create a Docker Network
Create a custom Docker network for communication between containers:

```
docker network create ecommerce-network
```

## 3. Run the Backend Container
Run the backend container and attach it to the `ecommerce-network`:

```
docker run -d --name ecommerce-backend --network ecommerce-network -p 5000:5000 -e MONGO_URI="mongodb+srv://darrenctsang:i7Ro7OmIsM3p9Rgo@cluster0.cqcfq.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0" -e JWT_SECRET="ecommerce_jwt_secret_9f8g7h6j5k4l3m2n1p0q_20240321" darrenct/ecommerce-backend:latest
```

## 4. Run the Frontend Container
Run the frontend container and set the `VITE_API_URL` environment variable to point to the backend:
```
docker run -d --name ecommerce-frontend --network ecommerce-network -p 5173:5173 -e VITE_API_URL=http://ecommerce-backend:5000 darrenct/ecommerce-frontend:latest
```
## 5. Verify the Containers are Running
Check that both containers are running:

```
docker ps
```

### You should see:
- ecommerce-backend on port 5000
- ecommerce-frontend on port 5173

## 6. Test the Application
Open a browser and go to:
   - Frontend: http://localhost:5173


## 7. Cleanup 
To stop and remove the containers and network:
```
docker stop ecommerce-frontend ecommerce-backend
docker rm ecommerce-frontend ecommerce-backend
docker network rm ecommerce-network
```

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
- `cd ../frontend`

Install all dependencies
- `npm install`

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