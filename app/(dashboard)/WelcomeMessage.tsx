"use client";

import { useUser } from "@clerk/nextjs";
export const WelcomeMessage = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="space-y-2 mt-4 ">
      <h2 className="text-white text-2xl lg:text-4xl">
        Welocome Back{isLoaded ? ", " : ""}
        {user?.firstName || user?.username}
      </h2>
      <p className="text-sm lg:text-base  text-[#e96fb]">
        {" "}
        This is your Dashboard
      </p>
    </div>
  );
};
