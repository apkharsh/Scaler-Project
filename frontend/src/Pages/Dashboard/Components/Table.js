import React, { useEffect, useState } from "react";
import Loader from "../../../Assets/Lotties/Loader.json";
import Lottie from "lottie-react";
import { BASE_URL } from "../../../Config/url";

export default function Table({ selected }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/bookings/all`);
            // const response = await fetch(`${BASE_URL}/bookings/all`,{
            //     params: {}
            // });
            var dataLocal = await response.json();

            // change checkInTime and checkOutTime from unix to date and time
            dataLocal.filtered_bookings.forEach((item) => {
                const currentTime = new Date().getTime();
                const checkInTime = new Date(item.checkInTime).getTime();
                const checkOutTime = new Date(item.checkOutTime).getTime();

                if (currentTime >= checkInTime && currentTime <= checkOutTime)
                    item.status = "checked in";
                else if (currentTime > checkOutTime)
                    item.status = "checked out";
                else item.status = "not checked in";

                item.checkInTime = new Date(item.checkInTime).toLocaleString();
                item.checkOutTime = new Date(
                    item.checkOutTime
                ).toLocaleString();
            });
            const filterData = dataLocal.filtered_bookings;
            setFilteredData(filterData);
            setData(filterData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("Something went wrong");
        }
    };
    // use effect
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
      if(selected === "all") return setData(filteredData);
      const filterData = data.filter((item) => selected ? item.status === selected : true);
      setData(filterData);
    }, [selected]);

    const headings = [
        {
            id: 1,
            name: "Room No.",
        },
        {
            id: 2,
            name: "Room Type",
        },
        {
            id: 3,
            name: "Customer",
        },
        {
            id: 4,
            name: "Check-in",
        },
        {
            id: 5,
            name: "Check-out",
        },
        {
            id: 6,
            name: "Amount",
        },
        {
            id: 7,
            name: "Status",
        },
    ];

    return (
        <table className="w-full min-w-[10rem] overflow-auto">
            <thead className="bg-zinc-100 bg-opacity-50">
                <tr>
                    {headings.map((item) => {
                        return (
                            <td
                                key={item.id}
                                className="py-3 px-4 min-w-[150px] text-zinc-600"
                            >
                                <p>{item.name}</p>
                            </td>
                        );
                    })}
                </tr>
            </thead>
            <tbody className="bg-white text-black">
                {loading ? (
                    <tr>
                        <td colSpan="7">
                            <div className="w-full flex flex-col justify-center items-center">
                                <Lottie
                                    className="w-52"
                                    animationData={Loader}
                                    loop={true}
                                />
                                <p className="-mt-8 pb-2">Loading...</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    data.map((item) => {
                        return (
                            <tr className="border-b" key={item._id}>
                                <td className="py-2 px-4">
                                    {item.roomID.roomNumber}
                                </td>
                                <td className="py-2 px-4">
                                    {item.roomID.roomType}
                                </td>
                                <td className="py-2 px-4">{item.userName}</td>
                                <td className="py-2 px-4">
                                    {item.checkInTime}
                                </td>
                                <td className="py-2 px-4">
                                    {item.checkOutTime}
                                </td>
                                <td className="py-2 px-4">{item.totalPrice}</td>
                                <td className="py-2 px-4">
                                    <p
                                        className={`border w-[max-content] px-2 py-1 rounded-md text-[14px] capitalize
                    ${item.status === "checked in" && "bg-red-200 text-red-700"}
                    ${
                        item.status === "checked out" &&
                        "bg-green-200 text-green-700"
                    }
                    ${
                        item.status === "not checked in" &&
                        "bg-yellow-200 text-yellow-700"
                    }
                  `}
                                    >
                                        &#x2022; &nbsp;{item.status}
                                    </p>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}
