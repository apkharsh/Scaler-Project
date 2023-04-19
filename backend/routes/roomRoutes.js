const express = require('express');
const router = express.Router();

const { createRoom, deleteRoom, getAllRooms, deleteRoomByNumber } = require('../controllers/RoomController.js');

// BASE: /api/rooms/
router.get('/all', getAllRooms); // Search Params will be used
router.post('/create', createRoom); // Create a room
router.delete('/delete/:id', deleteRoom); // delete by ID
router.delete('/deleteByNumber/:roomNumber', deleteRoomByNumber); // delete by room number

module.exports = router;