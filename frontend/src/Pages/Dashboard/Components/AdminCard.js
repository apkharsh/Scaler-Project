import React from "react";

export default function AdminCard() {
  return (
    <div className="bg-amber-200 p-5 rounded-2xl">
      <div className="flex items-center gap-5">
        <div>logo</div>
        <div className="flex flex-col">
          <div className="">
            <h1> Harsh Kumar </h1>
            <p className="text-[13px] text-gray-400"> Hotel Booking </p>
          </div>
          <p>Student</p>
        </div>
      </div>

      <div>
        <h1>ROLE</h1>
        <p> Adminstrator </p>
      </div>
    </div>
  );
}
