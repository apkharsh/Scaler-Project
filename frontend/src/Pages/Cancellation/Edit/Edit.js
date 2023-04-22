import React, { useState, useEffect } from "react";
import avatar from "../../../Assets/avatar.png";
import { useNavigate } from "react-router";
import { useParams, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import Success from "../../../Assets/Lotties/Success.json";
import Loader from "../../../Assets/Lotties/Loader.json";
import { AnimatePresence } from "framer-motion";
// use cors
import cors from "cors";
import { BASE_URL } from "../../../Config/url";
import Error from "../../../Components/Error";

cors();

export default function Edit() {
    const navigate = useNavigate();

    const locaiton = useLocation();
    const [data, setData] = useState(locaiton.state?.data);

    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [error, setError] = useState(null);

    function convertDateTimeLocalToUnixTime(datetimeLocalStr) {
        const dateObj = new Date(datetimeLocalStr);
        const unixTime = dateObj.getTime();
        return unixTime;
    }

    const formattedData = () => {
        const checkIn = data?.checkInTime;
        const checkOut = data?.checkOutTime;
        const unixTime = convertDateTimeLocalToUnixTime(checkIn);
        const unixTime2 = convertDateTimeLocalToUnixTime(checkOut);
        return { unixTime, unixTime2 };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            };
        });
    };
    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading1(true);

        // console.log(data)
        const { unixTime, unixTime2 } = formattedData();

        const { userName, email, roomType , checkInTime, checkOutTime } = data;
        const roomNumber = data.roomNumber;
        // checkin and checkout time is coming form above convertDateTimeLocalToUnixTime function

        const response = await fetch(`${BASE_URL}/bookings/update/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                xFormUrlEncoded: "true",
            },
            body: JSON.stringify({
                username: userName,
                email: email,
                startTime: unixTime,
                endTime: unixTime2,
                roomType: roomType,
                roomNumber: roomNumber,
            }),
        });

        const result = await response.json();
        // console.log(result);

        setLoading1(false);
        if (result.error) {
            setError(result.error);
            <Error error={error} />;
            return;
        } else {
            setLoading2(true);
            setTimeout(() => {
                setLoading2(false);
                navigate("/");
            }, 1000);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setError(null);
        }, 3000);
    }, [error]);

    return (
        <form className="w-full relative" onSubmit={handleSubmit}>
            <div className="flex flex-col xl:flex-row gap-10">
                <div className="w-full xl:w-[25%] flex flex-col justify-center xl:justify-start items-center xl:items-start gap-10">
                    <div>
                        <img
                            src={avatar}
                            alt="profile_picture"
                            className="w-24 rounded-full"
                        />
                    </div>

                    <div className="text-md text-gray-500">
                        <p className="text-center xl:text-left">
                            {" "}
                            Enter the required information to update.{" "}
                        </p>
                        <p className="text-center xl:text-left ">
                            {" "}
                            These are editable.{" "}
                        </p>
                    </div>
                </div>

                {/* username, email, roomType, startTime, endTime, roomNumber  */}
                <div className="flex flex-col md:flex-row gap-5 xl:gap-10 justify-between flex-1">
                    <div className="flex-1 flex flex-col gap-4">
                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-xl">
                                Username
                            </label>
                            <input
                                type="text"
                                name="userName"
                                value={data?.userName}
                                onChange={handleChange}
                                placeholder="ApkHarsh"
                                className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-xl">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={data?.email}
                                onChange={handleChange}
                                placeholder="harsh.kumar@gmail.com"
                                className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                            />
                        </div>

                        {/* Room Details */}
                        <div className="flex gap-3">
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="" className="text-xl">
                                    Room No.
                                </label>
                                <input
                                    type="text"
                                    name="roomNumber"
                                    placeholder="Number"
                                    value={data?.roomNumber}
                                    onChange={handleChange}
                                    className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="" className="text-xl">
                                    Room Type
                                </label>
                                <input
                                    type="text"
                                    name="roomType"
                                    value={data?.roomType}
                                    onChange={handleChange}
                                    placeholder="Type"
                                    className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Check-in-out */}
                    <div className="md:w-[40%] lg:w-[45%] flex flex-col justify-center items-center gap-4">
                        <div className="rounded-md border px-4 py-5 w-full h-full bg-white flex flex-col justify-between shadow hover:shadow-lg transition-all ease-linear">
                            <input
                                type="datetime-local"
                                name="checkInTime"
                                value={data?.checkInTime}
                                onChange={handleChange}
                                id=""
                                className="text-2xl font-bold outline-none"
                            />
                            <p className="text-[16px] text-gray-600">
                                {" "}
                                Check-in{" "}
                            </p>
                        </div>
                        <div className="rounded-md border px-4 py-5 w-full h-full bg-white flex flex-col justify-between shadow hover:shadow-lg transition-all ease-linear">
                            <input
                                type="datetime-local"
                                name="checkOutTime"
                                value={data?.checkOutTime}
                                onChange={handleChange}
                                id=""
                                className="text-2xl font-bold outline-none"
                            />
                            <p className="text-[16px] text-gray-600">
                                {" "}
                                Check-out{" "}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex item-center w-full justify-end mt-5">
                <button
                    onSubmit={handleSubmit}
                    disabled={loading1 || loading2}
                    className="px-2 w-full xl:w-52 py-6 rounded-xl bg-black text-white hover:bg-[#000000] hover:shadow-xl transition-all"
                >
                    Update
                </button>
            </div>
            <AnimatePresence>
                {loading1 && (
                    <div className="bg-[#FDFDFD] bg-opacity-90 w-full h-full absolute top-0 left-0 flex items-center justify-center">
                        <Lottie
                            animationData={Loader}
                            className="w-[10rem]"
                            loop={false}
                        />
                    </div>
                )}
                {loading2 && (
                    <div className="bg-[#FDFDFD] bg-opacity-90 w-full h-full absolute top-0 left-0 flex items-center justify-center">
                        <Lottie
                            animationData={Success}
                            className="w-[10rem]"
                            loop={false}
                        />
                    </div>
                )}
                {error !== null && <Error error={error} />}
            </AnimatePresence>
        </form>
    );
}
