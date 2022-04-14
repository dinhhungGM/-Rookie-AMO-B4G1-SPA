import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import HomeTable from "../components/HomeTable";
import { getListAssignment } from "../../home/homeSlice";

const Home = () => {
  const { assignments: Assignment, listChange } = useSelector(
    (state) => state.home,
  );

  const [isRefresh, setisRefresh] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListAssignment());
  }, [dispatch, listChange, isRefresh]);

  useEffect(() => {
    const collection = document.getElementsByClassName("option");
    for (let item of collection) {
      const newNode = document.createElement("label");
      newNode.innerHTML = item.textContent;
      item.replaceChild(newNode, item.childNodes[1]);
    }
  }, []);

  const handleonRefresh = () => {
    setisRefresh(!isRefresh);
  };

  return (
    <div id="user-listing" style={{ paddingTop: "50px" }}>
      <div
        className="titleview"
        style={{
          color: "red",
          fontFamily: "Segoe UI, Arial",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        My Assignment
      </div>

      {Assignment && (
        <>
          <HomeTable listitem={Assignment} onRefresh={handleonRefresh} />
        </>
      )}
    </div>
  );
};

export default Home;
