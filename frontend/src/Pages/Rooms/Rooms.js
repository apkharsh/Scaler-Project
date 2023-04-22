import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { CloseIcon, CubeIcon } from "../../Components/Icons";
import { AnimatePresence, motion } from "framer-motion";
import A from "../../Assets/Rooms/A.png";
import B from "../../Assets/Rooms/B.jpeg";
import C from "../../Assets/Rooms/C.jpg";
import { BASE_URL } from "../../Config/url";
// import { useCallback } from "react";

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    // const [roomNumber, setRoomNumber] = useState(0);

    const [isOpen, setIsOpen] = useState(false);

    const handleModal = (val) => {
        setIsOpen(val);
    };

    const getAllRooms = async () => {
        const res = await fetch(`${BASE_URL}/rooms/all`);
        const data = await res.json();
        setRooms(data.rooms);
    };
    

    const handleClick = async (roomNumber) => {
        // console.log(roomNumber);
        try {
            const res = await fetch(`${BASE_URL}/rooms/deleteByNumber/${roomNumber}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if(res.status === 200) {
                // fetch again the list of available rooms
                // getAllRooms();
                console.log("room deleted")
            }
            else{
                console.log("Error");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllRooms();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.2,
            }}
            className="flex flex-col gap-5 h-full overflow-hidden"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-4xl lg:text-5xl font-black flex items-center gap-2">
                    Rooms
                    <span>
                        <CubeIcon className="w-10 h-10" />
                    </span>
                </h1>
                <button
                    onClick={() => handleModal(true)}
                    className="hover:scale-105 transition-all ease-linear"
                >
                    <CloseIcon className="rotate-45 w-8 h-8" />
                </button>
            </div>

            <div className="border-t border-gray-400"></div>

            <div className="flex flex-col justify-center items-center md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-3 overflow-auto">
                {rooms.map((room) => {
                    return (
                        <div className="min-w-[15rem] max-w-[16rem] min-h-[12rem] relative shadow-md hover:shadow-xl transition-all ease-linear rounded-2xl flex flex-col overflow-hidden bg-white">
                            <div className="h-24 w-full">
                                <img
                                    src={
                                        (room.roomType === "Standard" && A) ||
                                        (room.roomType === "Deluxe" && B) ||
                                        (room.roomType === "Supreme" && C)
                                    }
                                    alt="background"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <div className="flex justify-between text-sm px-2 pt-4 pb-1">
                                <p className="bg-gray-200 px-4 py-1 text-md font-medium rounded-full">
                                    Room No. {room.roomNumber}
                                </p>
                            </div>
                            <div className="flex justify-between text-sm px-2 pt-4 pb-1">
                                <button
                                    onClick={()=>{
                                        // setRoomNumber(room.roomNumber);
                                        handleClick(room.roomNumber);
                                    }}
                                    name="delete"
                                    value={room.roomNumber}
                                    className="bg-gray-200 px-4 py-1 text-md font-medium rounded-full"
                                >
                                    delete
                                </button>
                            </div>
                            <div className="h-full px-3 py-2 ">
                                <h1 className="text-2xl font-bold">
                                    {room.roomType}
                                </h1>
                                <p className="text-xl font-semibold">
                                    ₹{room.price}{" "}
                                    <span className="text-[14px] text-gray-400 font-normal">
                                        /per hour
                                    </span>{" "}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {isOpen && <Modal handleModal={handleModal} />}
            </AnimatePresence>
        </motion.div>
    );
}
