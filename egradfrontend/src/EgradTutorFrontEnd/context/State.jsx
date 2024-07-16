import React, { useState } from "react";
import myContext from "./MyContext";

export const State = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const showThreshold = 200;

    setIsVisible(scrollY > showThreshold);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: adds a smooth scrolling effect
    });
  };

  // Attach the scroll event listener when the component mounts
  const scrol = React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <myContext.Provider
      value={{ isVisible, setIsVisible, handleScroll, scrollToTop, scrol }}
    >
      {props.children}
    </myContext.Provider>
  );
};
