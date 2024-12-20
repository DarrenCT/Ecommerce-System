# E-Commerce System

## Quick Links
- [Run Docker Images Locally](#step-by-step-guide-to-run-the-e-commerce-project-docker-images-locally)
- [Run Code Locally](#run-code-locally)
    - **add provided `.env` on Eclass to root directory after cloning repo and skip step 2**
    - If you don't see the `.env` file after downloading from eclass, make sure hidden files are enabled in your file explorer.

# Step-by-Step Guide to Run the E-Commerce Project Docker Images Locally
### **Install and Run Docker Desktop**  
   Ensure Docker Desktop (or Docker Engine for Linux) is installed on your machine:
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
### **Note**: Docker Desktop must be running before proceeding.
### 1. Pull Docker Images
Ensure the backend and frontend images are pulled from Docker Hub:
```
docker pull darrenct/ecommerce-backend:latest
docker pull darrenct/ecommerce-frontend:latest
```
### 2. Create a Docker Network
Create a custom Docker network for communication between containers:

```
docker network create ecommerce-network
```

### 3. Run the Backend Container
Run the backend container and attach it to the `ecommerce-network`:

```
docker run -d --name ecommerce-backend --network ecommerce-network -p 5000:5000 -e MONGO_URI="mongodb+srv://darrenctsang:i7Ro7OmIsM3p9Rgo@cluster0.cqcfq.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0" -e JWT_SECRET="ecommerce_jwt_secret_9f8g7h6j5k4l3m2n1p0q_20240321" darrenct/ecommerce-backend:latest
```

### 4. Run the Frontend Container
Run the frontend container and set the `VITE_API_URL` environment variable to point to the backend:
```
docker run -d --name ecommerce-frontend --network ecommerce-network -p 5173:5173 -e VITE_API_URL=http://ecommerce-backend:5000 darrenct/ecommerce-frontend:latest
```
### 5. Verify the Containers are Running
Check that both containers are running:

```
docker ps
```

 **You should see:**
- ecommerce-backend on port 5000
- ecommerce-frontend on port 5173

### 6. Test the Application
Open a browser and go to:
   - Frontend: http://localhost:5173
   - Admin Panel: http://localhost:5173/admin.html
        - Note: The only admin entry point is `/admin.html`, refreshing on other admin pages will result in a 404 error. 
        - **Navigate only using the sidebar buttons.**   


### 7. Cleanup 
To stop and remove the containers and network:
```
docker stop ecommerce-frontend ecommerce-backend
docker rm ecommerce-frontend ecommerce-backend
docker network rm ecommerce-network
```


# Prerequisites for Local Development
- Install Docker Desktop (or Docker Engine for Linux):
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install Docker Compose (included in Docker Desktop for Windows/Mac)

# Run Code Locally

1. Clone the repository
```bash
git clone https://github.com/DarrenCT/Ecommerce-System.git
```

2. Create environment files (skip if .env provided)
   - Create `.env` file in the root directory with your MongoDB connection string:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Build and run the containers
```bash
docker compose up --build
```

This will:
- Build both frontend and backend containers
- Start the frontend on http://localhost:5173
- Start the backend on http://localhost:5000
- Access the admin panel on http://localhost:5173/admin.html
    - The only admin entry point is `/admin.html`, refreshing on other admin pages will result in a 404 error. 
    - **Navigate only using the sidebar buttons.**
- Enable hot-reload for both frontend and backend development

4. Stop the application
```bash
docker compose down
```

### Development Workflow
- Frontend code is in the `frontend` directory
- Backend code is in the `server` directory
- Changes to the code will automatically trigger a rebuild thanks to the development mode configuration
- Frontend will hot-reload when you make changes to the React code
- Backend will restart when you make changes to the Node.js code

### Troubleshooting
- If containers don't start, check Docker logs: `docker compose logs`
- Ensure ports 5173 and 5000 are not in use by other applications
- If you modify dependencies (package.json), rebuild containers: `docker compose up --build`

## Contribution
We follow the Git Flow workflow to manage development and ensure a structured process for feature development and releases. Here's how you can contribute to the project:

### Git Flow Branch Naming Convention:

- `main`: Holds the production-ready code.
- `develop`: Integrates all completed features and serves as the staging branch for upcoming releases.
- Feature branches: `feature/[feature-name]` – Used for developing individual features.
- Bugfix branches: `bugfix/[issue-name]` – For fixing bugs found in the develop branch.
- Hotfix branches: `hotfix/[issue-name]` – For critical fixes to the main branch.
- Release branches: `release/[version-number]` – Prepares for the next production release.

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