# Virtual Pet Frontend 🧬

This is the **frontend application** for the Virtual Pet project, inspired by the Medabots universe. Built with **React**, it allows users to register, log in, and interact with a variety of customizable robot pets.

> 🔗 **Backend Repository:**  
> https://github.com/trisk910/5.2--React-Virtual-Pet-Backend.git

---

## 📚 Project Overview

This frontend connects with a backend built using **Spring Boot** and **MySQL**, handling user authentication via JWT and supporting CRUD operations for virtual pets. The frontend interface was adjusted from an AI-generated base to integrate with the backend API and present a game-like experience.

---

## 🌟 Features

- 🔐 **Authentication**
  - User Registration and Login with JWT
- 🤖 **Virtual Pet Management**
  - Customize and interact with robot pets
  - Access different modules such as Battle Arena, Workshop, and Upgrade Shop
- 🏆 **Leaderboard**
  - Displays competitive stats for users
- 🧭 **Navigation**
  - Header and welcome screen components

---

## 🔧 Technologies Used

- React
- React Router
- Axios
- CSS / inline styling
- LocalStorage (for JWT token management)

---

## 🔄 Integration with Backend

This React app communicates with the backend via **Axios HTTP requests**.

### ✅ Key Integration Points

- **Login & Register**
  - Communicates with `/auth/login` and `/auth/register` endpoints to receive/store JWT
- **Protected Routes**
  - Uses JWT stored in `localStorage` to authenticate API calls
- **Pet Features**
  - Pet management (e.g., interactions, upgrades) likely maps to CRUD endpoints in the backend
- **Role-Based Features**
  - Admin and User roles retrieved from the backend JWT token
  - Future enhancements may include role-based rendering

> Make sure to start the backend at `http://localhost:8080` (or configure your `.env`) for correct integration.

---

## 🧠 Learning Objectives

Explore how AI-generated frontend code can be analyzed, corrected, and connected to a real backend.
Understand secure frontend-backend integration using JWT.
Build user interfaces with reusable components and real-time data.
