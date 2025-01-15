import React from "react";

import DesktopBanner from "../assets/images/banner.jpg";
import { useSelector } from "react-redux";

function Home() {
  const categoryData = useSelector((state) => state?.product.allCategory);
  console.log("category data", categoryData);
  return (
    <section className="container mx-auto  px-4">
      <div className=" ">
        <img src={DesktopBanner} alt="banner-img" className="w-full" />
      </div>

      {/* Display all category */}
      <div className="grid grid-cols-2 md:gird-cols-4 lg:grid-cols-6 gap-4">
        {categoryData.map((cat, index) => {
          return (
            <div key={cat._id} className=" p-2 ">
              <img
                src={cat.image}
                alt={cat.name}
                className="rounded-md shadow-md"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Home;
