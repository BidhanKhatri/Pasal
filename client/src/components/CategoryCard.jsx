import React from "react";

const CategoryCard = ({ data }) => {
  console.log("ako data", data);

  return (
    <div className="flex gap-4 items-center">
      {data.map((elem, index) => {
        return (
          <div key={index} className="my-8">
            <div
              className="  p-4 flex flex-col gap-2 rounded-md"
              style={{ boxShadow: "0 0 4px rgba(0,0,0,.2)" }}
            >
              <div className="bg-neutral-50 h-48 w-48 rounded-md">
                <img
                  src={elem.image[0].url}
                  alt="cat-img"
                  className="h-full w-full object-scale-down"
                />
              </div>
              <div className="rounded-md p-2">
                <p className="truncate">Name: {elem.name}</p>
                <p>Discount Price: Rs {elem.discount}</p>
                <div className="flex gap-4 ">
                  <p>Unit: {elem.unit}</p>
                  <p>Stock: {elem.stock}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryCard;
