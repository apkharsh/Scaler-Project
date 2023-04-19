import React, { useEffect, useState } from "react";
import avatar from "../../../Assets/avatar.png";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router";
import { BASE_URL } from "../../../Config/url";

export default function Cancel() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [refund, setRefund] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(location.state?.data);

  const { id } = useParams();

  const handleModal = (props) => {
    setIsOpen(props);
  };

  const getRefund = () => {
    fetch(`${BASE_URL}/bookings/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // xFormUrlEncoded: "true",
      },
    }).then((res) => {
      res.json().then((item) => {
        console.log(item);
        setIsOpen(false);
        navigate("/checkout");
      });
    });
  };

  useEffect(() => {
    fetch(`${BASE_URL}/bookings/getRefundAmount/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // xFormUrlEncoded: "true",
      },
    })
      .then((res) => {
        res.json().then((item) => {
          console.log(item);
          setRefund(item.Refund);
          console.log(id);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex justify-center items-center px-1">
        <div className="min-w-full sm:min-w-[25rem] h-[max-content]  rounded-xl">
          <div className="rounded-2xl bg-s1 shadow-xl">
            <h1 className="text-white font-black text-4xl text-center px-2 py-5">
              RECEIPT
            </h1>
          </div>

          {/* reciept */}
          <div className="rounded-2xl shadow-xl w-full pt-10 -mt-1 py-3 px-2 flex flex-col gap-8">
            {/* Refund Amount */}
            <div className="flex flex-col items-center gap-2">
              <h1 className="font-semibold text-3xl"> ₹{refund} </h1>
              <p className="text-md text-gray-400 pb-1">
                {" "}
                Room service & booking cost{" "}
              </p>
              <div className="bg-yellow-200 bg-opacity-40 rounded-xl text-[13px] px-4 py-1 text-yellow-600">
                &#x2022; Pre-Booked
              </div>
            </div>

            {/* User Detail */}
            <div className="flex flex-col gap-4 px-2">
              <div className="border-t border-gray-200"></div>

              <div className="flex items-center gap-3">
                <img src={avatar} alt="profile" className="w-14 rounded-full" />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium"> {data?.userName} </h3>
                  <p className="text-[14px] text-gray-500">{data?.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Checks */}
              <div className="">
                <h2 className="font-medium text-lg pb-1"> Checks </h2>
                <div className="flex items-center gap-3">
                  <h3 className="text-gray-500 w-14"> From: </h3>
                  <p> {data?.checkInTime.replace(/\//g, "-")} </p>
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="text-gray-500 w-14 "> To: </h3>
                  <p> {data?.checkOutTime.replace(/\//g, "-")} </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel button */}
          <div className="py-8 flex flex-col gap-3">
            <button
              onClick={() => handleModal(true)}
              className="px-2 py-3 rounded-md shadow-md hover:shadow-xl transition-all ease-linear bg-red-500 text-white w-full"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && <Modal getRefund={getRefund} handleModal={handleModal} />}
      </AnimatePresence>
    </div>
  );
}
