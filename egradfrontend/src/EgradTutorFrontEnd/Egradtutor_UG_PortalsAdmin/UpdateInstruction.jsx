import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/otcCss.css";
import BASE_URL from "../../apiConfig";

export const UpdateInstruction = () => {
  const [points, setPoints] = useState([]);
  const { instructionId, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/InstructionCreation/instructionpoints/${instructionId}/${id}`
        );
        setPoints(
          response.data.points.map((item) => ({
            ...item,
            points: String(item.points),
          }))
        );
        console.log("Response:", response.data);
        console.log("instructionId:", instructionId);
        console.log("id:", id);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [instructionId, id]);

  const handleInputChange = (index, newValue) => {
    const updatedPoints = [...points];
    updatedPoints[index] = { ...updatedPoints[index], points: newValue };
    setPoints(updatedPoints);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/InstructionCreation/updatepoints/${instructionId}/${id}`,
        {
          points: points.map((item) => item.points),
        }
      );
      window.location.reload();
      console.log("Update Response:", response.data);
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  return (
    <div className="Instruction_-points_-container otsMainPages">
      <div>
        <button
          type="button"
          onClick={() => navigate("/Adminpage")}
          className="ots_-createBtn"
        >
          Go back
        </button>
      </div>
      <div className="InstructionEditPoints">
        <h3 className="textColor">Update Instruction point</h3>
        <br />
        {points.map((item, index) => (
          <div
            key={index}
            className="Instruction_-points_-content"
            style={{ display: "flex", gap: "1rem" }}
          >
            <label htmlFor="">{index + 1}</label>
            <textarea
              type="text"
              value={item.points}
              id="Update_Instruction_point"
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}
        <br />
        <button className="instructionBTN" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
};
