// In controllers/bookings.js
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { get_available_rooms, send_email, checkRoomAvailability } = require("./Helper");

// /api/bookings/create
// COMPLETE
const bookRoom = async (req, res) => {
    
    const { username, email, roomType, startTime, endTime, roomNumber } = req.body;

    if (!username || !email || !startTime || !endTime) {
        return res.status(400).json({
            error: "Please enter all the fields",
        });
    } 
    else {
        // If room number is given, check that exact room
        if (roomNumber == null) {

            if (roomType == null) {
                return res.status(400).json({
                    error: "Please enter a room type",
                });
            }

            // Get available rooms
            let available_rooms = await get_available_rooms(
                startTime,
                endTime,
                roomType
            );

            if (available_rooms.length == 0) {
                return res.status(400).json({
                    error: "No rooms available",
                });
            } else {
                // Pick the first room
                const roomID = available_rooms[0];

                // Get the Price of the room
                const room = await Room.findById(roomID);
                const price = room.price;
                const numHours = Math.ceil((endTime - startTime) / 3600000);
                const totalPrice = price * numHours;

                // Create a new booking
                const booking = new Booking({
                    roomID: roomID,
                    userName: username,
                    email: email,
                    checkInTime: startTime,
                    checkOutTime: endTime,
                    totalPrice: totalPrice,
                });

                // Save the booking
                await booking.save();

                // Populate and send the booking
                const populated_booking = await Booking.findById(
                    booking._id
                ).populate("roomID");

                // SEND EMAIL TO USER REGARDING THE BOOKING
                await send_email(populated_booking);

                res.status(200).json({
                    message: "Booking successful",
                    booking: populated_booking,
                });
            }
        } else {
            // roomNumber is given, check that exact room

            // Get available rooms
            let available_rooms = await get_available_rooms(
                startTime,
                endTime,
                roomType
            );

            // get room with roomNumber
            const room_wanted = await Room.findOne({ roomNumber: roomNumber });

            available_rooms = available_rooms.map((room_id) =>
                room_id.toString()
            );

            if (available_rooms.includes(room_wanted._id.toString())) {
                // Book the room
                const roomID = room_wanted._id;

                // Get the Price of the room
                const price = room_wanted.price;
                const numHours = Math.ceil((endTime - startTime) / 3600000);
                const totalPrice = price * numHours;

                // Create a new booking
                const booking = new Booking({
                    roomID: roomID,
                    userName: username,
                    email: email,
                    checkInTime: startTime,
                    checkOutTime: endTime,
                    totalPrice: totalPrice,
                });

                // Save the booking
                await booking.save();

                // Populate and send the booking
                const populated_booking = await Booking.findById(
                    booking._id
                ).populate("roomID");

                // SEND EMAIL TO USER REGARDING THE BOOKING
                await send_email(populated_booking);

                res.status(200).json({
                    message: "Booking successful",
                    booking: populated_booking,
                });
            } else {
                // Room not available
                res.status(400).json({
                    error: "Room not available",
                });
            }
        }
    }
};

// /api/bookings/update/:id
// COMPLETE
const updateBooking = async (req, res) => {

    const { email, username, startTime, endTime, roomNumber } = req.body;
    
    // Get the booking with the given id
    // Check if the booking exists
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("roomID");

    // if booking not found on that id
    if (!booking) {
        return res.status(400).json({
            error: "Booking not found",
        });
    }
    else {

        let final_val = {};
        
        if (email) {
            final_val.email = email;
        }
        else
        {
            final_val.email = booking.email;
        }

        if (username) {
            final_val.userName = username;
        }
        else
        {
            final_val.userName = booking.userName;
        }

        if (startTime) {
            final_val.checkInTime = startTime;
        }
        else
        {
            final_val.checkInTime = booking.startTime;
        }

        if (endTime) {
            final_val.checkOutTime = endTime;
        }
        else
        {
            final_val.checkOutTime = booking.endTime;
        }

        // var flag = false;

        if (roomNumber) {
            // Find Room ID
            const room = await Room.findOne({ roomNumber: roomNumber });
            
            if (!room) {
                // flag = true;                
                return res.status(400).json({
                    error: "Room not found",
                });
            }
            else
            {
                final_val.roomID = room._id;
            }
        }
        else
        {
            final_val.roomID = booking.roomID;
        }

        // Check if this booking is possible
        // Check room availability
        const isPossible = await checkRoomAvailability(final_val.roomID, final_val.checkInTime, final_val.checkOutTime, booking._id);

        if (!isPossible) {
            return res.status(400).json({
                error: "Room not available",
            });
        }

        // Update the booking
        await Booking.findByIdAndUpdate(id, final_val);

        // Populate and send the booking
        const populated_booking = await Booking.findById(id).populate("roomID");

        return res.status(200).json({
            message: "Booking updated successfully",
            booking: populated_booking,
        });
    }
};

// /api/bookings/delete/:id
// COMPLETE
const deleteBooking = async (req, res) => {

    const { id } = req.params;

    try {
        // Find the booking with the given id
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(400).json({
                error: "Booking not found",
            });
        }

        // Delete the booking
        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            message: "Booking deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

// /api/bookings/getRefundAmount/:id
// COMPLETE
const getRefundAmount = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            error: "Please enter the booking ID",
        });
    } else {
        try {
            // Find the booking with the given id
            const booking = await Booking.findById(id);

            if (!booking) {
                return res.status(400).json({
                    error: "Booking not found",
                });
            }

            // Calculate the refund amount
            const refundAmount = booking.getRefund();

            res.status(200).json({
                Refund: refundAmount,
            });
        } catch (error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

// /api/bookings/all?roomType=A&roomNumber=101&startTime=t1&endTime=t2&id='xyz'
// COMPLETE
const getBookings = async (req, res) => {
    
    console.log("Find Bookings...");

    try {
        const { id, roomType, roomNumber, startTime, endTime } = await req.query;

        if (id) {
            // Find a single booking with a bookingId
            const booking = await Booking.findById(id);

            // Populate the room
            const populated_booking = await Booking.findById(
                booking._id
            ).populate("roomID");

            return res.status(200).json({
                booking: populated_booking,
            });
        } 
        else {

            let filters = {};

            if (startTime && endTime) {
                filters.checkInTime = { $gte: startTime };
                filters.checkOutTime = { $lte: endTime };
            }

            const bookings = await Booking.find(filters);

            let filtered_bookings = [];

            // Populate the rooms
            for (let i = 0; i < bookings.length; i++) {
                
                const populated_booking = await Booking.findById(
                    bookings[i]._id
                ).populate("roomID");

                // check if roomType is given
                if (roomType != null) {
                    // check if roomType matches
                    if (populated_booking.roomID.roomType == roomType) {
                        filtered_bookings.push(populated_booking);
                    }
                }

                // check if roomNumber is given
                if (roomNumber != null) {
                    // check if roomNumber matches
                    if (populated_booking.roomID.roomNumber == roomNumber) {
                        filtered_bookings.push(populated_booking);
                    }
                }

                if(roomType == null && roomNumber == null)
                    filtered_bookings.push(populated_booking);
            }
            return res.status(200).json({
                filtered_bookings,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

module.exports = {
    bookRoom,
    updateBooking,
    deleteBooking,
    getBookings,
    getRefundAmount,
};
