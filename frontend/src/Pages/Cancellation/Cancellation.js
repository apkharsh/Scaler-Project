import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CancelIcon2, EditIcon } from "../../Components/Icons";
import { Link } from "react-router-dom";
import Loader from "../../Assets/Lotties/Loader.json";
import Lottie from "lottie-react";
import { BASE_URL } from "../../Config/url";

export default function Cancellation() {
    // converting time from unix to date and time so that it can be used in input type="datetime-local"
    function convertTime(unixTime) {
        
        const dateObj = new Date(unixTime);
        if (unixTime.toString().length === 10) {
            // Unix time is in seconds, convert to milliseconds
            dateObj.setTime(unixTime * 1000);
        }

        const year = dateObj.getFullYear();
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        const day = ("0" + dateObj.getDate()).slice(-2);
        const hours = ("0" + dateObj.getHours()).slice(-2);
        const minutes = ("0" + dateObj.getMinutes()).slice(-2);

        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        return formattedDate;
    }

    // this state is handling the data from the backend
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = useState(false);

    // this function is fetching data from the backend for all the bookings
    const fetchData = async () => {
        setLoading(true);

        const response = await fetch(`${BASE_URL}/bookings/all`);
        var dataLocal = await response.json();
        // change checkInTime and checkOutTime from unix to date and time
        dataLocal.filtered_bookings.forEach((item) => {

            const currentTime = new Date().getTime();
            const checkInTime = new Date(item.checkInTime).getTime();
            const checkOutTime = new Date(item.checkOutTime).getTime();

            if (currentTime >= checkInTime && currentTime <= checkOutTime) item.status = "checked in";
            else if (currentTime > checkOutTime) item.status = "checked out";
            else item.status = "not checked in";

            item.checkInTime = convertTime(item.checkInTime);
            item.checkOutTime = convertTime(item.checkOutTime);
        });

        console.log(dataLocal.filtered_bookings)

        setData(dataLocal.filtered_bookings);
        setLoading(false);
    };

    // use effect
    React.useEffect(() => {
        fetchData();
    }, []);

    const headings = [
        {
            id: 1,
            name: "Room No.",
        },
        {
            id: 2,
            name: "Room Type",
        },
        {
            id: 3,
            name: "Customer",
        },
        {
            id: 4,
            name: "Check-in",
        },
        {
            id: 5,
            name: "Check-out",
        },
        {
            id: 6,
            name: "Amount",
        },
        {
            id: 7,
            name: "Actions",
        },
    ];

    return (
        <motion.div className="w-full border h-[max-content] shadow rounded-xl scrollbar-hide overflow-x-auto ">
            <table className="w-full min-w-[10rem] overflow-auto">
                <thead className="bg-zinc-100 bg-opacity-50">
                    <tr>
                        {headings.map((item) => {
                            return (
                                <td
                                    key={item.id}
                                    className={`py-3 px-4 min-w-[150px] text-zinc-600 
                    ${item.name === "Actions" && "min-w-[70px]"}`}
                                >
                                    <p>{item.name}</p>
                                </td>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="text-black text-[14px]">
                    {loading ? (
                        <tr>
                            <td colSpan="6">
                                <div className="w-full flex flex-col justify-center items-center">
                                    <Lottie
                                        className="w-52"
                                        animationData={Loader}
                                        loop={true}
                                    />
                                    <p className="-mt-8 pb-2">Loading...</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => {
                            if (item.status === "not checked in") {
                                return (
                                    <tr className="border-b" key={item._id}>
                                        <td className="py-2 px-4">
                                            {item.roomID.roomNumber}
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.roomID.roomType}
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.userName}
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.checkInTime}
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.checkOutTime}
                                        </td>
                                        <td className="py-2 px-4">
                                            {item.totalPrice}
                                        </td>
                                        <td className="py-2 px-4 w-[70px]">
                                            <div className="flex gap-5 items-center">
                                                <Link
                                                    to={`./edit/${item._id}`}
                                                    state={{ data: item }}
                                                    className="hover:shadow-xl hover:scale-105 transition-all ease-linear rounded-full bg-blue-100 p-1"
                                                >
                                                    <EditIcon className="w-6 h-6" />
                                                </Link>

                                                <Link
                                                    to={`./cancel/${item._id}`}
                                                    state={{ data: item }}
                                                    className="hover:shadow-xl hover:scale-105 transition-all ease-linear rounded-full bg-red-100 p-1"
                                                >
                                                    <CancelIcon2 className="w-6 h-6" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        })
                    )}
                </tbody>
            </table>
        </motion.div>
    );
}
