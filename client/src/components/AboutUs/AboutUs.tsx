import React from "react";
import Header from "../Header/Header";

const AboutUs = () => {
  return (
    <div>
      <Header />
      <h1 className="font-bold text-7xl text-center">
        Organize your life, Increase your productivity
      </h1>
      <h3 className="font-bold text-3xl">WHO ARE WE?</h3>
      <div>
        One year back, when two people join the same company and later became
        good friends. They started working together,chit chatting, sharing their
        feeling. They wanted to progress in life together,and wanted to help
        each other so they built this project as their first step to success. We
        started woring on this new Advanced Task manager app which will help us
        understand more about MERN technology specially Mongodb, Express, and
        Node.js.
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default AboutUs;
