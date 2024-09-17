import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve("..", ".env") });

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://pathsforthefuture.vercel.app"], // Allow requests from your React app
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Sensitive Information
// eslint-disable-next-line no-undef
const ONET_USERNAME = process.env.ONET_USERNAME;
// eslint-disable-next-line no-undef
const ONET_PASSWORD = process.env.ONET_PASSWORD;

// POST route to handle API requests from the front-end
app.post("/api/search", async (req, res) => {
  const { keyword } = req.body; // Extract keyword from the request body
  const ONET_API_URL = `https://services.onetcenter.org/ws/mnm/search?keyword=${encodeURIComponent(
    keyword ? keyword : ""
  )}`;

  try {
    const externalApiResponse = await axios.get(ONET_API_URL, {
      auth: {
        username: ONET_USERNAME,
        password: ONET_PASSWORD,
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

app.post("/api/careerSearch", async (req, res) => {
  const { careerLink } = req.body; // Extract careerLink from the request body
  try {
    const externalApiResponse = await axios.get(careerLink, {
      auth: {
        username: ONET_USERNAME,
        password: ONET_PASSWORD,
      },
      headers: {
        Accept: "application/json",
      },
    });

    const educationIndex =
      externalApiResponse.data.resources.resource.findIndex(
        (resource) => resource.title === "Education"
      );

    let educationData = {};
    if (educationIndex !== -1) {
      educationData = await axios.get(
        externalApiResponse.data.resources.resource[educationIndex].href,
        {
          auth: {
            username: ONET_USERNAME,
            password: ONET_PASSWORD,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );
    }

    const technologyIndex =
      externalApiResponse.data.resources.resource.findIndex(
        (resource) => resource.title === "Technology"
      );

    let technologyData = {};
    if (technologyIndex !== -1) {
      technologyData = await axios.get(
        externalApiResponse.data.resources.resource[technologyIndex].href,
        {
          auth: {
            username: ONET_USERNAME,
            password: ONET_PASSWORD,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );
    }

    const outlookIndex = externalApiResponse.data.resources.resource.findIndex(
      (resource) => resource.title === "Job Outlook"
    );

    let outlookData = {};
    if (outlookIndex !== -1) {
      outlookData = await axios.get(
        externalApiResponse.data.resources.resource[outlookIndex].href,
        {
          auth: {
            username: ONET_USERNAME,
            password: ONET_PASSWORD,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );
    }

    const otherJobsIndex =
      externalApiResponse.data.resources.resource.findIndex(
        (resource) => resource.title === "Explore More"
      );

    let otherJobsData = {};
    if (otherJobsIndex !== -1) {
      otherJobsData = await axios.get(
        externalApiResponse.data.resources.resource[otherJobsIndex].href,
        {
          auth: {
            username: ONET_USERNAME,
            password: ONET_PASSWORD,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );
    }

    // Send the external API's response data back to the frontend
    const dataToSend = {
      career: externalApiResponse.data,
      education: educationData.data,
      technology: technologyData.data,
      outlook: outlookData.data,
      otherJobs: otherJobsData.data,
    };
    res.json(dataToSend);
  } catch (error) {
    // Handle errors (e.g., if the external API request fails)
    console.error("Error making API call:", error.message);
    res.status(500).json({ error: "Failed to fetch data from external API" });
  }
});

app.post("/api/prevPageSearch", async (req, res) => {
  const { pageLink } = req.body; // Extract careerLink from the request body
  try {
    const externalApiResponse = await axios.get(pageLink, {
      auth: {
        username: ONET_USERNAME,
        password: ONET_PASSWORD,
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

app.post("/api/nextPageSearch", async (req, res) => {
  const { pageLink } = req.body; // Extract careerLink from the request body
  try {
    const externalApiResponse = await axios.get(pageLink, {
      auth: {
        username: ONET_USERNAME,
        password: ONET_PASSWORD,
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

app.post("/api/interestProfilerQuestions", async (req, res) => {
  const { link } = req.body;
  try {
    const externalApiResponse = await axios.get(link, {
      auth: {
        username: ONET_USERNAME,
        password: ONET_PASSWORD,
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

app.post("/api/getResultsForQuestions", async (req, res) => {
  const { link } = req.body;
  try {
    const externalApiResponse = await axios.get(link, {
      auth: {
        username: ONET_USERNAME,
        password: ONET_PASSWORD,
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

app.post("/api/getRecommendedJobs", async (req, res) => {
  const { link } = req.body;
  try {
    const externalApiResponse = await axios.get(link, {
      auth: {
        username: ONET_USERNAME,
        password: ONET_PASSWORD,
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
