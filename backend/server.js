const express = require("express");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/bookingRoutes.js");
const roomRoutes = require("./routes/roomRoutes.js");
const db = require("./db.js");
const app = express();
const cors = require("cors");


// Middleware
app.use(cors());
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

// now use these routes
app.use("/api/bookings/", bookingRoutes);
app.use("/api/rooms/", roomRoutes);

// connect to MongoDB
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB!"));

// CLEAR DB
app.get("/api/clear", async (req, res) => {
    await db.dropDatabase();
    res.status(200).json({
        message: "Database cleared",
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));