const Room = require("../models/Room");

// /api/rooms/create?roomType=XYZ
// COMPLETE
const getAllRooms = async (req, res) => {
    if (req.query.roomType != null) {
        const rooms = await Room.find({
            roomType: req.query.roomType,
        });

        res.status(200).json({
            rooms,
        });
    } else {
        const rooms = await Room.find();

        res.status(200).json({
            rooms,
        });
    }
};

// api/rooms/create
// COMPLETE
const createRoom = async (req, res) => {
    
    const { roomType, roomNumber, price } = req.body;

    if (roomType == null || roomNumber == null || price == null) {
        return res.status(400).json({
            error: "Fill all the fields",
        });
    } 
    else {
        
        try {

            const room = new Room({
                roomType: roomType,
                roomNumber: roomNumber,
                price: price,
            });

            await room.save();

            res.status(200).json({
                message: "Room created successfully",
                room,
            });

        } catch (error) 
        {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

// api/rooms/delete/:id
// COMPLETE
const deleteRoom = async (req, res) => {
    
    const roomID = req.params.id;

    // Check if there is a room with the given ID
    const room = await Room.findById(roomID);

    if (room == null) {
        return res.status(400).json({
            error: "No room with the given ID",
        });
    } else {
        try {
            await Room.findByIdAndDelete(roomID);
            res.status(200).json({
                message: "Room deleted successfully",
            });
        } catch (error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

// api/rooms/delete_by_number/:roomNumber
// COMPLETE
const deleteRoomByNumber = async (req, res) => {

    const roomNumber = req.params.roomNumber;

    // Check if there is a room with the given room number
    const room = await Room.findOne({
        roomNumber: roomNumber,
    });

    if (room == null) {
        return res.status(400).json({
            error: "No room exists with the given room number",
        });
    } else {
        try {
            await Room.findByIdAndDelete(room._id);
            res.status(200).json({
                message: "Room deleted successfully",
            });
        } catch (error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

module.exports = {
    getAllRooms,
    createRoom,
    deleteRoom,
    deleteRoomByNumber,
};
