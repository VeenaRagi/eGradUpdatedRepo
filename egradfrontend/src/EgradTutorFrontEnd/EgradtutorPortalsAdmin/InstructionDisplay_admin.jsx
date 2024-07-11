import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ReactTooltip, { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import BASE_URL from "../../apiConfig"
import { FaSearch } from "react-icons/fa";

const InstructionDisplay_admin = () => {
  const [points, setPoints] = useState([]);
  const { instructionId } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const [instruction, setInstructionPoints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const validateForm = () => {
    const errors = {};

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/InstructionCreation/instructionData`
        );
        setInstructionPoints(response.data.points);
        console.log("Response:", response.data);
        console.log("instructionId:", instructionId);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [instructionId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/InstructionCreation/instructionpointsGet`
        );
        setPoints(response.data.points);
        console.log("Response:", response.data);
        console.log("instructionId:", instructionId);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [instructionId]);

  const handleDelete = async (instructionId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/InstructionCreation/deleteinstruction/${instructionId}`
      );
      window.location.reload();
      console.log("Delete Response:", response.data);
      // Add logic to update your component state or perform other actions after deletion
    } catch (error) {
      console.error("Error deleting data:", error.message);
    }
  };

const handleSearchInputChange = (event) => {
  setSearchQuery(event.target.value);
  setCurrentPage(1); // Reset current page to 1 when search query changes
};
  const filteredInstruction = instruction.filter(
    (instruction) =>
      instruction.instructionHeading &&
      instruction.instructionHeading
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
const filteredData = filteredInstruction.filter((data) =>
  data.examName.toLowerCase().includes(searchQuery.toLowerCase())
);
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber);
   };
   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
;
  return (
    <div className="Instruction_containerTable">
      <div className="create_exam_header_SearchBar">
        {/* Search bar */}
        <FaSearch className="Adminsearchbaricon" />
        <input
          className="AdminSearchBar"
          type="text"
          placeholder="Search By Instructions Heading"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <h3 className="list_-otsTitels">Uploaded Instruction documents</h3>

      <table className="otc_-table">
        <thead className="otsGEt_-contantHead otc_-table_-header">
          <tr>
            <th style={{ textAlign: "center" }}>S.no</th>
            <th style={{ textAlign: "center" }}>EXAM NAME</th>
            <th style={{ textAlign: "center" }}>Instructions Heading</th>

            <th style={{ textAlign: "center" }}>Document Name</th>

            <th style={{ textAlign: "center" }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody className="otc_-table_-tBody" style={{ textAlign: "center" }}>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="6">No Instruction found.</td>
            </tr>
          ) : (
            currentItems.map((ite, inde) => (
              <tr key={inde} className={inde % 2 === 0 ? "color1" : "color2"}>
                <td style={{ textAlign: "center" }}>{ite.instructionId}</td>
                <td style={{ padding: 10 }}>{ite.examName}</td>
                <td style={{ padding: 10 }}>{ite.instructionHeading}</td>
                <td style={{ padding: 10 }}>{ite.documentName}</td>

                <td>
                  <div className="tooltip-container  EditDelete_-btns">
                    <Link
                      to={`/Instruction/editIns/${ite.instructionId}`}
                      // title="Open Instruction Points"
                      className="my-anchor-element1 Ots_-edit"
                      data-tooltip-variant="info"
                      data-tooltip-delay-show={1000}
                      style={{
                        background: "#00aff0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                      }}
                    >
                      Open
                    </Link>
                    <Tooltip anchorSelect=".my-anchor-element1" place="top">
                      Open Instruction Points
                    </Tooltip>

                    <button
                      className="Ots_-delete my-anchor-element"
                      data-tooltip-variant="warning"
                      data-tooltip-delay-show={1000}
                      onClick={() => handleDelete(ite.instructionId)}
                      style={{ background: "rgb(220 53 69)" }}
                    >
                      <i
                        class="fa-regular fa-trash-can"
                        style={{ color: "#fff" }}
                      ></i>
                    </button>
                    <Tooltip anchorSelect=".my-anchor-element" place="top">
                      Delete
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          )}
          {/* {instruction.map((ite, inde) => (
            <tr
            
              key={inde}
              className={ite.instructionId % 2 === 0 ? "color1" : "color2"}
            >
              <td>{ite.instructionId}</td>
              <td>{ite.examId}</td>
              <td>{ite.instructionHeading}</td>
              <td>{ite.documentName}</td>

              <td>
                
                <div className="tooltip-container  EditDelete_-btns">
                  <Link
                    to={`/Instruction/editIns/${ite.instructionId}`}
                    // title="Open Instruction Points"
                    className="my-anchor-element1 Ots_-edit"
                    data-tooltip-variant="info"
                    data-tooltip-delay-show={1000}
                  >
                   Open
                  </Link>
                  <Tooltip anchorSelect=".my-anchor-element1" place="top">
                    Open Instruction Points
                  </Tooltip>

                  <button
                  className="Ots_-delete my-anchor-element"
                  data-tooltip-variant="warning"
                  data-tooltip-delay-show={1000}
                  onClick={() => handleDelete(ite.instructionId)}
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
                <Tooltip anchorSelect=".my-anchor-element" place="top">
                  Delete
                </Tooltip>
                </div>
              </td>

            </tr>
          ))} */}
        </tbody>
      </table>
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
      <div className="Instruction_Dis"></div>
    </div>
  );
};

export default InstructionDisplay_admin;
