import React from "react";

const SkeletonCategory = () => {
  return (
    <div className="my-8">
      <div className=" h-44 w-44 min-h-56 rounded-md min-w-56 p-4 flex flex-col gap-4 bg-neutral-100 animate-pulse shadow-sm">
        <div className="bg-neutral-200 h-full w-full rounded-md"></div>

        <div className="bg-neutral-200 h-12 w-full rounded-md"></div>
      </div>
    </div>
  );
};

export default SkeletonCategory;
