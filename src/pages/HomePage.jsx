import React from "react";
import { useHostStore } from "../store/useHostStore";

const HomePage = () => {
  const { properties, loading, fetchProperties } = useHostStore();
  console.log("properties", properties);
  return <div>HomePage</div>;
};

export default HomePage;
