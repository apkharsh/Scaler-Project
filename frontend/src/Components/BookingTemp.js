import React, { useState } from "react";
import Lottie from "lottie-react";
import Bg from "../Assets/Lotties/Bg.json";
import BookNow from "../Pages/Booking/BookNow";
import { motion } from "framer-motion";

export default function BookingTemp({ children }) {
  const [isSelected, setIsSelected] = useState(true);
  const handleChange = () => {
    setIsSelected(!isSelected);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
      }}
      className="w-full flex flex-col gap-5"
    >
      <div className="bg-s1 rounded-2xl h-52 flex items-center justify-center relative overflow-hidden">
        <h1 className=" text-6xl md:text-8xl font-black text-black z-10">
          {" "}
          Booking{" "}
        </h1>
        <Lottie
          animationData={Bg}
          loop={false}
          className=" -bottom-2 right-0 absolute"
        />
      </div>

      <div className="">
        <h1 className="font-semibold text-zinc-700 text-2xl mb-8">
          User Information
        </h1>
        <BookNow />
      </div>
    </motion.div>
  );
}
