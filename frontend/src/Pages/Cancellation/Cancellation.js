import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CancelIcon2, EditIcon } from "../../Components/Icons";
import { Link } from "react-router-dom";
import Loader from "../../Assets/Lotties/Loader.json";
import Lottie from "lottie-react";

export default function Cancellation() {

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:5000/api/bookings/all");

    var dataLocal = await response.json();

    // change checkInTime and checkOutTime from unix to date and time
    dataLocal.filtered_bookings.forEach((item) => {
      // if current time is between checkInTime and checkOutTime then status = "checked in"
      // else if current time is after checkOutTime then status = "checked out"
      // else status = "not checked in"
      const currentTime = new Date().getTime();
      const checkInTime = new Date(item.checkInTime).getTime();
      const checkOutTime = new Date(item.checkOutTime).getTime();

      if (currentTime >= checkInTime && currentTime <= checkOutTime)
        item.status = "checked in";
      else if (currentTime > checkOutTime) item.status = "checked out";
      else item.status = "not checked in";

      item.checkInTime = new Date(item.checkInTime).toLocaleString();
      item.checkOutTime = new Date(item.checkOutTime).toLocaleString();
    });
    setData(dataLocal.filtered_bookings);
    setLoading(false);
  };
  // use effect
  React.useEffect(() => {
    fetchData();
  }, []);

  const headings = [
    {
      id: 1,
      name: "Room",
    },
    {
      id: 2,
      name: "Customer",
    },
    {
      id: 3,
      name: "Check-in",
    },
    {
      id: 4,
      name: "Check-out",
    },
    {
      id: 5,
      name: "Amount",
    },
    {
      id: 6,
      name: "Actions",
    },
  ];
  return (
    <motion.div className="w-full border h-[max-content] shadow rounded-xl scrollbar-hide overflow-x-auto ">
      <table className="w-full min-w-[10rem] overflow-auto">
        <thead className="bg-zinc-100 bg-opacity-50">
          <tr>
            {headings.map((item) => {
              return (
                <td
                  key={item.id}
                  className={`py-3 px-4 min-w-[150px] text-zinc-600 
                    ${item.name === "Actions" && "min-w-[70px]"}
                  `}
                >
                  <p>{item.name}</p>
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody className="text-black text-[14px]">

{loading ? (
          <tr>
            <td colSpan="6">
              <div className="w-full flex flex-col justify-center items-center">
                <Lottie className="w-52" animationData={Loader} loop={true} />
                <p className="-mt-8 pb-2">Loading...</p>
              </div>
            </td>
          </tr>
        ) : (
          data.map((item) => {
            if(item.status === "not checked in") {
            return (
              <tr className="border-b" key={item._id}>
                <td className="py-2 px-4">{item.roomID.roomType}</td>
                <td className="py-2 px-4">{item.userName}</td>
                <td className="py-2 px-4">{item.checkInTime}</td>
                <td className="py-2 px-4">{item.checkOutTime}</td>
                <td className="py-2 px-4">{item.totalPrice}</td>
                <td className="py-2 px-4 w-[70px]">
              <div className="flex gap-5 items-center">
                <Link
                  to={`./edit/${item._id}`}
                  state={{ data: item }}
                  className="hover:shadow-xl hover:scale-105 transition-all ease-linear rounded-full bg-blue-100 p-1"
                >
                  <EditIcon className="w-6 h-6" />
                </Link>

                <Link
                  to={`./cancel/${item._id}`}
                  state={{ data: item }}
                  className="hover:shadow-xl hover:scale-105 transition-all ease-linear rounded-full bg-red-100 p-1"
                >
                  <CancelIcon2 className="w-6 h-6" />
                </Link>
              </div>
            </td>
              </tr>
            );
            }
          })
        )}


        </tbody>

      </table>
    </motion.div>
  );
}
