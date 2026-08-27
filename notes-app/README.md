# 📝 Notes App

A simple and user-friendly Notes Application built using the **MERN Stack**.

The application allows users to create, view, edit, delete, search, categorize, and pin their notes. It also includes user authentication so each user can manage their own notes securely.

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Email validation using validator
- Protected routes
- Logout functionality

### Notes

- Create notes
- View all notes
- View individual note details
- Edit notes
- Delete notes
- Pin / unpin notes
- Search notes
- Filter notes by category
- View all pinned notes

### Categories

Notes can be organized into:

- 📚 Study
- 💼 Work
- 💡 Ideas
- 💻 Projects
- ✅ Todo
- 🧑 Personal
- ⭐ Important
- 📝 Other

### User Interface

- Clean and minimal UI
- Responsive design
- Tailwind CSS styling
- Sidebar navigation
- User profile dropdown
- Loading states
- Empty states
- Toast notifications
- Mobile-friendly layout

---

## Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- validator

---


## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Nikitarathod2001/notes-app.git
```

### 2. Navigate to the project

```bash
cd notes-app
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure backend environment variables

Create:

```text
server/.env
```

and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 5. Start backend

```bash
npm run dev
```

---

### 6. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 7. Configure frontend environment variables

Create:

```text
client/.env
```

and add:

```env
VITE_BASE_URL=http://localhost:5000
```

### 8. Start frontend

```bash
npm run dev
```

---

## 📸 Application Flow

```text
Register
   ↓
Login
   ↓
Dashboard
   │
   ├── All Notes
   ├── Pinned
   ├── Categories
   ├── Search
   └── Create Note
          ↓
       Note Details
          │
          ├── Edit
          ├── Delete
          └── Pin / Unpin
```

---

## Future Improvements

Possible future improvements:

- Dark mode
- Rich text editor
- Image attachments
- Note sorting
- Pagination
- Email verification
- Password reset
- Profile management
- Cloud deployment

---

## Author

**Nikita Rathod**

THANK YOU!

---
