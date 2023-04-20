import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Cancellation from "../Pages/Cancellation/Cancellation";
import CancelTemp from "../Components/CancelTemp";
import Edit from "../Pages/Cancellation/Edit/Edit";
import Cancel from "../Pages/Cancellation/Cancel/Cancel";

export default function CancelRoutes() {
  return (
    <CancelTemp>
      <Routes>
        <Route path="/" element={<Cancellation />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/cancel/:id" element={<Cancel />} />
        <Route path="*" element={<Navigate to="/checkout" />} />
      </Routes>
    </CancelTemp>
  );
}
