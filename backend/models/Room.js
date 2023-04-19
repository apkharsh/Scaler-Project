const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },
    roomType: {
        type: String,
        required: true,
    },
    // Hourly
    price: {
        type: Number,
        required: true,
    }
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
