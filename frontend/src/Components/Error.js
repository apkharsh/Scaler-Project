import React from "react";
import { motion } from "framer-motion";

export default function Error(props) {
    return (
        <div className="fixed bg-black bg-opacity-80 top-0 left-0 w-full h-full flex justify-center py-10">
            <motion.div
                initial={{ y: -500 }}
                animate={{ y: 0 }}
                exit={{ y: -500 }}
                className=" w-[max-content] max:w-[60%] h-[max-content] bg-red-500 py-4 px-3 rounded-xl text-xl font-semibold shadow-xl"
            >
                <span className="text-white font-bold">Error: </span>
                <span className="text-white font-normal">{props.error}</span>
            </motion.div>
        </div>
    );
}
