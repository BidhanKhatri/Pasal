import React from "react";
import UserProfileModel from "../components/UserProfileModel";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <section className=" grid grid-cols-[300px,1fr]">
      {/* left side ko menu ko lagi */}
      <div className="min-h-screen sticky overflow-y-scroll top-0 py-4 px-6 shadow-md bg-white">
        <UserProfileModel />
      </div>

      {/* right side ko content ko lagi */}
      <div className=" py-4 px-10">
        <Outlet />
      </div>
    </section>
  );
};

export default Dashboard;
