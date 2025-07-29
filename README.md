DevConnect: A Full-Stack Portfolio Platform


1. Project Overview
DevConnect is a modern, full-stack application designed as a portfolio and social platform for developers. It allows users to sign up, create profiles, showcase their projects, and provide feedback on the work of others.
This document provides a comprehensive guide for setting up and running the DevConnect application in a local development environment. The project is architected as a monorepo, containing two primary packages:
/server: A Node.js and Express.js backend API that handles business logic, data persistence with MongoDB, and user authentication.
/client: A React (Vite) single-page application that provides the user interface.



2. Prerequisites
Before you begin, ensure you have the following software installed on your machine:
Node.js: Version 18.x or later. You can download it from nodejs.org.
npm: Version 8.x or later. npm is included with the Node.js installation.
Git: Required for cloning the repository.
MongoDB: A local or cloud-hosted MongoDB instance is required for the server. You can use MongoDB Atlas for a free cloud database.



3. Local Development Setup Guide
Follow these steps to get the application running on your local machine.
Step 1: Clone the Repository
First, clone the project repository from your version control system to a local directory.
# Replace <your-repo-url> with the actual URL of the repository
git clone <your-repo-url>

# Navigate into the project directory
cd devconnect


Step 2: Configure Server Environment Variables
The server requires a set of environment variables to connect to the database and manage security keys.
Navigate to the /server directory.
Create a copy of the example environment file and name it .env:
cp server/.env.example server/.env


Open the newly created server/.env file in a text editor and update the following variables:

MONGO_URI: Replace the placeholder with your actual MongoDB connection string.
Example for MongoDB Atlas: mongodb+srv://<user>:<password>@cluster.mongodb.net/<databaseName>?retryWrites=true&w=majority
JWT_ACCESS_SECRET: Provide a long, random, and secret string for signing access tokens. You can generate one using an online tool or your terminal.
Example generation in terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_REFRESH_SECRET: Provide a different long, random, and secret string for signing refresh tokens.
Your configured server/.env file should look like this:PORT=5001
MONGO_URI=mongodb+srv://myuser:mypassword@mycluster.mongodb.net/devconnect_db?retryWrites=true&w=majority
JWT_ACCESS_SECRET=a1b2c3d4e5f6...
JWT_REFRESH_SECRET=f6e5d4c3b2a1...
CLIENT_ORIGIN=http://localhost:5173


Step 3: Install All Dependencies
From the root directory of the project (/devconnect), run the following command. This single command will automatically install all the necessary npm packages for the root, the /server, and the /client.
npm install


Step 4: Run the Application
Once the dependencies are installed and the environment variables are set, you can start both the client and server concurrently with a single command from the root directory.
npm run dev


This command uses the concurrently package to execute the npm run dev script in both the /server and /client directories simultaneously.
Step 5: Verification
You should see output in your terminal indicating that both servers have started successfully:
The backend API server will be running on http://localhost:5001.
The frontend React application will be running on http://localhost:5173.
Open your web browser and navigate to http://localhost:5173. You should see the DevConnect homepage. The application is now running locally.



Access the App: The application will be available at http://localhost.
4. Available Scripts
The following scripts are available to be run from the project's root directory:
npm run dev: Starts both the client and server in development mode with hot-reloading.
npm install: Installs dependencies for all packages (root, server, client).
npm run client: Starts only the client development server.
npm run server: Starts only the server with nodemon.
npm test: Runs tests for both the client and server.
