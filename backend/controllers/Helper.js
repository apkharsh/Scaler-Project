const Booking = require("../models/Booking");
const Room = require("../models/Room");
const nodemailer = require("nodemailer");
// use dotenv
const dotenv = require("dotenv");
dotenv.config();

const get_available_rooms = async (
    start_time,
    end_time,
    type_preference = null
) => {
    const bookings = await Booking.find({
        $or: [
            {
                $and: [
                    { checkInTime: { $lte: start_time } },
                    { checkOutTime: { $gte: start_time } },
                ],
            },
            {
                $and: [
                    { checkInTime: { $lte: end_time } },
                    { checkOutTime: { $gte: end_time } },
                ],
            },
        ],
    });

    const booked_rooms = bookings.map((booking) => booking.roomID);

    if (type_preference != null) {
        const available_rooms = await Room.find({
            $and: [
                { _id: { $nin: booked_rooms } },
                { roomType: type_preference },
            ],
        });

        // Return IDs of available rooms if any are found
        return available_rooms.map((room) => room._id);

    } else {
        const available_rooms = await Room.find({
            _id: { $nin: booked_rooms },
        });

        // Return IDs of available rooms
        return available_rooms.map((room) => room._id);
    }
};


const checkRoomAvailability = async (roomID, startTime, endTime, bookingIdToIgnore=null) => {

    const bookings = await Booking.find({
        $and: [
            { roomID: roomID },
            { _id: { $ne: bookingIdToIgnore } },
            {
                $or: [
                    {
                        $and: [
                            { checkInTime: { $lte: startTime } },
                            { checkOutTime: { $gte: startTime } },
                        ],
                    },
                    {
                        $and: [
                            { checkInTime: { $lte: endTime } },
                            { checkOutTime: { $gte: endTime } },
                        ],
                    },
                ],
            },
        ],
    });

    if (bookings.length == 0) {
        return true;
    } else {
        return false;
    }
}


const unix_time_to_date = (unix_time) => {
    const date = new Date(unix_time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    return `${day}/${month}/${year} ${hours}:${minutes.substring(
        minutes.length - 2
    )}:${seconds.substring(seconds.length - 2)}`;
};

const send_email = async (booking) => {
    const email = booking.email;
    const userName = booking.userName;
    const checkInTime = unix_time_to_date(booking.checkInTime);
    const checkOutTime = unix_time_to_date(booking.checkOutTime);
    const roomNumber = booking.roomID.roomNumber;

    console.log("Sending email to: ", email);

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        }
    });

    // Create the email
    const mailOptions = {
        from: "apk.harsh.dev@gmail.com",
        to: email,
        secure: false,
        subject: "Booking Confirmed",
        text: `Hello ${userName},\n\nYour booking has been confirmed.\n\nRoom Number: ${roomNumber}\nCheck In Time: ${checkInTime}\nCheck Out Time: ${checkOutTime}\n\nThank you for choosing us.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log("Email sent successfully");
        }
    });
};

// Export the function
module.exports = {
    get_available_rooms,
    send_email,
    checkRoomAvailability
};
