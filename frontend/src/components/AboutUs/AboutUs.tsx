import React from "react";
import Header from "../Header/Header";

const AboutUs = () => (
  <div className="h-screen flex flex-col">
    <Header />
    <main className="flex-grow flex items-center justify-center">
      <span className="font-light text-white text-5xl text-center">
        Organize your life, Increase your productivity
      </span>
    </main>
  </div>
);

export default AboutUs;
