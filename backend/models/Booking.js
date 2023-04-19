const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    roomID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Room",
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    checkInTime: {
        type: Number,
        required: true,
    },
    checkOutTime: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
});

bookingSchema.methods.getRefund = function () {

    var curr_time = new Date().getTime();

    var remaining_time = this.checkInTime - curr_time;

    var remaining_hours = remaining_time / 3600000;

    if (remaining_hours >= 48) {
        // 100% refund
        return this.totalPrice;
    } else if (remaining_hours >= 24) {
        // 50% refund
        return this.totalPrice / 2;
    }
    // No refund
    return 0;
}

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
