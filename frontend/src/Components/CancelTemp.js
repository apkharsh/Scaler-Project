import React from "react";
import { motion } from "framer-motion";
import { CancellationIcon, CloseIcon } from "../Components/Icons";
import { Link, useLocation } from "react-router-dom";

export default function CancelTemp({ children }) {
  const route = useLocation().pathname.split("/");

  // remove empty string from route reverse
  const arr = route.reverse().filter((item) => item !== "");

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
        <h1 className="text-4xl lg:text-5xl font-black flex capitalize items-center gap-2">
          
          {arr.pop()}
          {route === "checkout" && (
            <span>
              <CancellationIcon className="w-11 h-11 " />
            </span>
          )}
        </h1>
        {/* <button
          // onClick={() => handleModal(true)}
          className="hover:scale-105 transition-all ease-linear outline-none"
        >
          <CloseIcon className="rotate-45 w-8 h-8" />
        </button> */}
      </div>

      <div className="border-t border-gray-400"></div>

      <div className="w-full h-full flex">{children}</div>
    </motion.div>
  );
}
