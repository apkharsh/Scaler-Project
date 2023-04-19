import React, { useState } from "react";
import { CloseIcon } from "../../../Components/Icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Modal({ handleModal, getRefund }) {
  const navigate = useNavigate();
  const handleNo = () => {
    handleModal(false);
    setTimeout(() => {
      navigate("/checkout");
    }, 200);
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
        <div className="w-[150px] h-1 rounded-full bg-gray-300 absolute top-2"></div>
        <div className="w-[90%] md:w-[50%] flex flex-col gap-5">
          <h1 className="font-black text-4xl uppercase text-center">confirm</h1>
          <div className="flex flex-col gap-5">
            <h2>
              {" "}
              Choosing this action will cause data irretrievable.
              <span>Do you still want to proceed?</span>
            </h2>

            <div className="flex items-center gap-3 font-medium">
              <button
                onClick={handleNo}
                className="bg-gray-300 hover:bg-gray-500 transition-all ease-linear text-black w-full py-3 rounded-md"
              >
                No
              </button>
              <button
                onClick={getRefund}
                className="bg-black hover:bg-[#000000] transition-all ease-linear text-white w-full py-3 rounded-md"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
