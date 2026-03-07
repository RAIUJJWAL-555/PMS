# Project Management System
# Copyright (c) 2026 Ujjwal Rai
# This project is licensed under GPL-3.0 License


# Team Task Management System - MERN

A Task Management System built using the MERN stack (MongoDB, Express, React, Node.js).

##  Day 1: Backend Foundation & Database Architecture

In Day 1, we focused on setting up the core infrastructure of the backend and defining the data layer.

### Tasks Completed:

✅ What I Completed
1️⃣ Backend Folder Structure

To keep the project clean and scalable, I organized the backend like this:
config/ → Database configuration
models/ → Mongoose schemas
controllers/ → Business logic (to be implemented in Day 2)
routes/ → API routes (to be implemented in Day 2)
middleware/ → Custom Express middlewares
This structure will help maintain clean separation of concerns as the project grows.

2️⃣ Environment & Dependencies Setup

express → Backend framework
mongoose → MongoDB 
jsonwebtoken → JWT-based authentication
cors → Cross-origin resource sharing
Autehntication for user login and registration
UI for login and registration page and after login there is a user dashboard page where you can see your name and role and a logout button

PORT
MONGO_URI
JWT_SECRET

3️⃣ Modules

Created Project creation API
Created Project dashboard UI

4️⃣Task Module
1. Create Task creation API : Here you can add task which is visible on Member and admin dashboard also
2. Assign task to user : When you are creating task using API then you are assign task to user

5️⃣ Status Tracking
1. Add status update feature : Here when member make any changes in task status then it will be updated and show to the admin dashboard
2. Show progress bar : According to changes in task your progress bar will be updated


6️⃣ Role-Based Access
● Admin vs Member role separation


7️⃣ Integration & Testing


More things from my side :- 
1. Claymorphism UI 
2. Leaderboard system, which motivates the members to do their work for got selected in next round
3. Exp points system, which will be given to the members for doing their work.
4. On admin dashboard there will be you see the members name who have more exp points.

This project was developed by Ujjwal Rai during internship.

Unauthorized copying, modification, or submission of this project as personal work without attribution is not allowed.