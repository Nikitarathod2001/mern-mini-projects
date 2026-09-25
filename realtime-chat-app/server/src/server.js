import express from "express";


const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Real-Time Chat App is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});