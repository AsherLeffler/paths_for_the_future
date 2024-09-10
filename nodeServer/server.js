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
  console.log("Received keyword:", keyword);
  try {
    // Make a request to the external API (for this example, we’ll use a placeholder)
    const externalApiResponse = await axios.get(
      `https://api.example.com/search`,
      {
        params: { query: keyword },
        headers: {
          Authorization: `Bearer YOUR_API_KEY`, // If your API requires an authorization key
        },
      }
    );

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
