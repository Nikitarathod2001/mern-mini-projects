# MERN Pagination Project

A simple full-stack product listing application built using the **MERN stack** that demonstrates server-side pagination. It fetches products from a MongoDB database and displays them page by page.

## Features

- Fetch products from the backend API.
- Display products in a responsive grid layout.
- Implement server-side pagination.
- Navigate between pages using Previous and Next buttons.
- Navigate directly to a specific page using page numbers.
- Disable navigation buttons when the user reaches the first or last page.
- Display product details such as name, category, price, and stock.

## Tech Stack

**Frontend**
- React.js
- JavaScript
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose


## How Pagination Works

1. The frontend maintains the current page using React's `useState`.
2. Whenever the page changes, `useEffect` triggers an API request.
3. The API receives the current page and limit as query parameters.
4. The backend retrieves the corresponding products from MongoDB.
5. The response contains the products and pagination metadata.
6. The pagination component uses this metadata to render page numbers and control navigation.

## Configuration

Create a `.env` file in the backend directory and configure your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Configure the frontend API base URL in the API service file according to your backend setup.

## Installation and Setup

**1. Clone the repository**

```bash
git clone https://github.com/Nikitarathod2001/mern-mini-projects.git
cd pagination-project
```

**2. Install backend dependencies**

```bash
cd server
npm install
```

**3. Start the backend**

```bash
npm run dev
```

**4. Install frontend dependencies**

Open another terminal:

```bash
cd client
npm install
```

**5. Start the frontend**

```bash
npm run dev
```

## Learning Objectives

- Understanding API integration in React.
- Working with `useState` and `useEffect`.
- Implementing server-side pagination.
- Passing props between React components.
- Managing pagination state and navigation.
- Fetching data from MongoDB through an Express API.

## Author

**Nikita Rathod**

B.E. Computer Engineering