import React, { useState } from "react";
import { CloseIcon } from "../../Components/Icons";
import { motion } from "framer-motion";

export default function Modal({ handleModal }) {
    const [data, setData] = useState({
        roomNumber: "",
        roomType: "",
        price: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { roomNumber, roomType , price} = data;
        console.log(data)

        fetch("http://localhost:5000/api/rooms/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                xFormUrlEncoded: "true",
            },
            // with data as body
            body: JSON.stringify({ roomNumber, roomType, price }),
        }).then((res) => {
            res.json()
                .then((data) => {
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 h-full w-full flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-25 overflow-hidden"
        >
            {/* Close */}
            <motion.button
                exit={{ opacity: 0 }}
                onClick={() => handleModal(false)}
                className="hover:scale-110 mb-52 md:mb-0 transition-all ease-linear bg-black text-white px-5 py-1 rounded-full"
            >
                close
                {/* <CloseIcon className="w-10 h-10 fill-zinc-100" /> */}
            </motion.button>

            {/* Main */}
            <motion.div
                initial={{ y: "90%" }}
                animate={{ y: 0 }}
                transition={{
                    type: "tween",
                    duration: 0.1,
                }}
                exit={{ y: "100%" }}
                className="bg-zinc-100 absolute bottom-0 rounded-t-[100px] md:rounded-t-full pb-4 flex flex-col justify-center items-center w-full lg:w-[80rem] h-[20rem]"
            >
                <div className="w-[150px] h-1 rounded-full bg-black absolute top-2"></div>
                <div className="w-[90%] md:w-[60%] flex flex-col gap-5">
                    <h1 className="font-black text-4xl uppercase text-center">
                        Create
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="" className="text-md">
                                        Room Number
                                    </label>
                                    <input
                                        type="number"
                                        name="roomNumber"
                                        onChange={handleChange}
                                        placeholder="Number"
                                        className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="" className="text-md">
                                        Room Type
                                    </label>
                                    <input
                                        type="text"
                                        name="roomType"
                                        onChange={handleChange}
                                        placeholder="Type"
                                        className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="" className="text-md">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        onChange={handleChange}
                                        placeholder="Price"
                                        className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <button
                                    onClick={handleSubmit}
                                className="bg-black hover:bg-[#000000] transition-all ease-linear text-white w-full py-3 rounded-md">
                                    {" "}
                                    Send{" "}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
}
