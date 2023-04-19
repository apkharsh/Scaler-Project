import React, { useState, useEffect } from "react";
import avatar from "../../../Assets/avatar.png";
import { useNavigate } from "react-router";
import { useParams, useLocation } from "react-router-dom";
// use cors
import cors from "cors";
import axios from "axios";

cors();

export default function Edit() {
  const navigate = useNavigate();

  const locaiton = useLocation();
  const [data, setData] = useState(locaiton.state?.data);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  console.log(data);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // user will enter the date in normal format but backend will only handle unix timestamp
    // so convert the date to unix timestamp

    if (name === "checkInTime") {
      const unixTime = new Date(value).getTime();
      setData((prevData) => {
        return {
          ...prevData,
          checkInTime: unixTime,
        };
      });
    } else if (name === "checkOutTime") {
      const unixTime = new Date(value).getTime();
      setData((prevData) => {
        return {
          ...prevData,
          checkOutTime: unixTime,
        };
      });
    } else {
      setData((prevData) => {
        return {
          ...prevData,
          [name]: value,
        };
      });
    }
  };
  const { id } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading1(true);
    const { userName, email, roomType, checkInTime, checkOutTime } = data;

    console.log(data);
    console.log(`http://localhost:5000/api/bookings/update/${id}`);

    let c1 = new Date(checkInTime).getTime();
    let c2 = new Date(checkOutTime).getTime();

    // send a post request to localhost:5000/api/bookings/create
    // with data as body
    fetch(`http://localhost:5000/api/bookings/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        xFormUrlEncoded: "true",
      },
      body: JSON.stringify({
        username: userName,
        email: email,
        startTime: c1,
        endTime: c2,
        roomType: roomType,
      }),
    })
      .then((res) => {
        res.json();
        setLoading1(false);
        setLoading2(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex gap-10">
        <div className="flex flex-col gap-10">
          <div>
            <img
              src={avatar}
              alt="profile_picture"
              className="w-24 rounded-full"
            />
          </div>

          <div className="text-md text-gray-500">
            <p> Enter the required information to update. </p>
            <p> These are editable. </p>
          </div>
        </div>

        {/* username, email, roomType, startTime, endTime, roomNumber  */}
        <div className="flex gap-10 justify-between flex-1">
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
          <div className="flex-1  flex flex-col justify-center items-center gap-4">
            <div className="rounded-md border px-4 py-5 w-full h-full bg-white flex flex-col justify-between shadow hover:shadow-lg transition-all ease-linear">
              <input
                type="datetime-local"
                name="checkInTime"
                value={data?.checkInTime}
                onChange={handleChange}
                id=""
                className="text-2xl font-bold outline-none"
              />
              <p className="text-[16px] text-gray-600"> Check-in </p>
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
              <p className="text-[16px] text-gray-600"> Check-out </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex item-center justify-end mt-5">
        <button className="px-2 w-52 py-3 rounded-md bg-p4 text-white hover:bg-red-500 hover:shadow-xl transition-all">
          Update
        </button>
      </div>
    </form>
  );
}
