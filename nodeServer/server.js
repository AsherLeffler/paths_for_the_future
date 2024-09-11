import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your React app
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// POST route to handle API requests from the front-end
app.post("/api/search", async (req, res) => {
  const { keyword } = req.body; // Extract keyword from the request body
  const ONET_API_URL = `https://services.onetcenter.org/ws/mnm/search?keyword=${encodeURIComponent(
    keyword ? keyword : ""
  )}`;

  try {
    const externalApiResponse = await axios.get(ONET_API_URL, {
      auth: {
        username: "paths_for_the_future",
        password: "4542dwb",
      },
      headers: {
        Accept: "application/json",
      },
    });

    // Send the external API's response data back to the frontend
    res.json(externalApiResponse.data);
  } catch (error) {
    // Handle errors (e.g., if the external API request fails)
    console.error("Error making API call:", error.message);
    res.status(500).json({ error: "Failed to fetch data from external API" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
