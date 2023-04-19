import React from "react";

export default function Error({ props }) {
  return (
    <div className="fixed top-2 left-0 w-full flex justify-center items-center">
      <div className=" w-[max-content] max:w-[60%] bg-red-400 py-4 px-3 rounded-xl text-xl font-semibold">
        Error
        <span className="text-white font-normal">{props}</span>
      </div>
    </div>
  );
}
