import React from "react";
import NavBar from "./NavBar";
const AboutUs = () => {
  return (
    <div>
      <NavBar />
      <h1 className="font-bold text-7xl text-center">
        FAST FOOD, FAST DELIVERY
      </h1>
      <h3 className="font-bold text-3xl">WHO ARE WE?</h3>
      <div>
        One year back, when two people join the same company and later became
        good friends. They started working together,chit chatting, sharing their
        feeling. They wanted to progress in life together,help each other so
        wanted to build a project as their first step to success. We started
        woring on this new food delivery app which will help us understand more
        about MERN technology specially Mongodb and Express, and may be node.js
        too.
      </div>
    </div>
  );
};

export default AboutUs;
