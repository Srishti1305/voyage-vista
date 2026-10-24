# VoyageVista

A full-stack travel discovery and trip-planning website built without React.

## Stack
- HTML5, CSS3, Vanilla JavaScript
- Node.js + Express.js
- MySQL
- JWT authentication + bcryptjs

## Features
- Destination discovery and search
- Destination detail pages and attractions
- Signup/login
- Favorites
- Personal trip planner and saved trips
- External booking links for trains, flights and hotels
- Responsive layout

## Run locally
1. Install Node.js and MySQL.
2. Run `database/schema.sql` in MySQL.
3. Copy `.env.example` to `.env` and enter your MySQL password and JWT secret.
4. In the project folder run `npm install`.
5. Run `npm run dev` (or `npm start`).
6. Open `http://localhost:5000`.

## Important
This project does not issue railway, flight or hotel reservations. Booking buttons redirect to third-party providers.
