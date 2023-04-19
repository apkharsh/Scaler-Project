const express = require('express');
const router = express.Router();

const { bookRoom, getBookings, updateBooking, deleteBooking, getRefundAmount } = require('../controllers/BookingController.js');

router.get('/all', getBookings); // Search Params will be used
router.get('/getRefundAmount/:id', getRefundAmount);
router.post('/create', bookRoom);
router.post('/update/:id', updateBooking);
router.delete('/delete/:id', deleteBooking);

module.exports = router;