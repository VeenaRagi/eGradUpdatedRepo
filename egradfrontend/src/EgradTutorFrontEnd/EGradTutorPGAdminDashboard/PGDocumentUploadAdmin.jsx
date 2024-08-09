import React, { useState, useEffect } from "react";
// import "./styles/DocumentUpload_admin.css";///
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import axios from "axios";
const PGDocumentUploadAdmin = () => {
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [file, setFile] = useState(null);
  const { testCreationTableId, sectionId } = useParams();

  useEffect(() => {
    // Fetch tests data
    fetch(`${BASE_URL}/DocumentUpload/testss`)
      .then((response) => response.json())
      .then((data) => setTests(data))
      .catch((error) => console.error("Error fetching tests data:", error));
  }, []);

  const handleTestChange = async (event) => {
    const testCreationTableId = event.target.value;
    setSelectedTest(testCreationTableId);

    // Fetch subjects data based on the selected test
    try {
      const response = await fetch(
        `${BASE_URL}/DocumentUpload/Pg_subjects/${testCreationTableId}`
      );

      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects data:", error);
    }
  };
  const handleSubjectChange = async (event) => {
    const selectedSubject = event.target.value;
    setSelectedSubject(selectedSubject);

    // Fetch sections data based on the selected subject
    try {
      const response = await fetch(
        `${BASE_URL}/DocumentUpload/sections/${selectedSubject}/${selectedTest}`
      );
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections data:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
    // if (validateForm()) {
    //   setSubmitting(true);
    const formData = new FormData();
    formData.append("document", file);
    formData.append("subjectId", selectedSubject);
    formData.append("sectionId", selectedSection);
    formData.append("testCreationTableId", selectedTest);

    fetch(`${BASE_URL}/DocumentUpload/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        alert("Successfully uploaded Document");
        // window.location.reload();
        // fetchData();
      })
      .catch((error) => {
        console.error(error);
      });

    // setSubmitting(false);
    //   }
  };


  return (
    <div className=" create_exam_container otsMainPages" >
      <div className="" >
        <h2 className="textColor">Document Upload Form </h2>
      </div>
      <form className="admin_document_upload_formm" >
        <div className="uploadedDocument_container examSubjects_-contant ">
          <div className="uploadedDocumentFilds  ">
            <label htmlFor="testSelect">Select Test:</label>
            <select
              id="testSelect"
              onChange={handleTestChange}
              value={selectedTest}
              required
            >
              <option value="">Select a Test</option>
              {tests.map((test) => (
                <option
                  key={test.testCreationTableId}
                  value={test.testCreationTableId}
                >
                  {test.TestName}
                </option>
              ))}
            </select>

          </div>

          <div className="uploadedDocumentFilds">
            <label htmlFor="subjectSelect">Select Subject:</label>
            <select
              id="subjectSelect"
              onChange={handleSubjectChange}
              value={selectedSubject}
            >
              <option value="">Select a Subject</option>
              {subjects.map((subject) => (
                <option key={subject.departmentId} value={subject.departmentId}>
                  {subject.departmentName}
                </option>
              ))}
            </select>

          </div>

          <div className="uploadedDocumentFilds">
            <label htmlFor="sectionsSelect">Select Sections:</label>
            <select
              id="sectionsSelect"
              onChange={handleSectionChange}
              value={selectedSection}
            >
              <option value="">Select a Section</option>
              {sections.map((section) => (
                <option key={section.sectionId} value={section.sectionId}>
                  {section.sectionName}
                </option>
              ))}
            </select>

          </div>

          <div className="uploadedDocumentFilds">
            <label htmlFor="">Upload file</label>
            <input type="file" accept=".docx" onChange={handleFileChange} id="uploadInputFile_ovl_upload_file" />

          </div>
        </div>

        <div className="uploadedDocumentFilds" style={{ float: "right" }} >
          <button className="ots_-createBtn" onClick={(e) => handleUpload(e)}>
            Upload
          </button>
        </div>
        <div></div>
      </form>

      {/* document info section */}
      <PGUploadedDoc />
    </div>
  );
};

export default PGDocumentUploadAdmin;

export const PGUploadedDoc = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const usersPerPage = 10;
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/DocumentUpload/documentName`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [documentData, setDocumentData] = useState([]);
  const handleDelete = async (document_Id) => {
    // Display a confirmation dialog before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document ?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `${BASE_URL}/DocumentUpload/DocumentDelete/${document_Id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message);
        const updatedDocumentData = documentData.filter(
          (item) => item.document_Id !== document_Id
        );
        console.log("Before:", documentData);
        console.log("After:", updatedDocumentData);
        setDocumentData(updatedDocumentData);
        fetchData();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    } else {
      // The user canceled the deletion
      console.log("Deletion canceled.");
    }
  };


  const handleDeleteSelected = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all selected Documents links?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/DocumentUpload/DocumentDelete`, {
        data: { ids: selectedIds },
      });
      fetchData();
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected video links:", error);
      alert("Failed to delete selected video links.");
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredDocument = data.filter(
    (data) =>
      data.documen_name &&
      data.documen_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageCount = Math.ceil(filteredDocument.length / usersPerPage);
  const pagesVisited = pageNumber * usersPerPage;
  const displayData = filteredDocument.slice(pagesVisited, pagesVisited + usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const toggleSelectAll = () => {
    if (!selectAll) {
      const ids = filteredDocument.map((data) => data.document_Id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
    setSelectAll(!selectAll);
  };


  const handleSingleCheckboxChange = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedIds = [...selectedIds];

    if (selectedIndex === -1) {
      newSelectedIds.push(id);
    } else {
      newSelectedIds.splice(selectedIndex, 1);
    }

    setSelectedIds(newSelectedIds);
  };


  return (
    <div className="documentInfo_container">
      <div className="otsTitels" style={{ padding: "0" }}></div>
      <div className="documentInfo_contant">
        <div>
          <div className="create_exam_header_SearchBar">
            {/* Search bar */}
            <FaSearch className="Adminsearchbaricon" />
            <input
              className="AdminSearchBar"
              type="text"
              placeholder="Search By Document Name"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
          <h3 className="list_-otsTitels">uploaded documents list</h3>

          <table className="otc_-table">
            <thead className="otsGEt_-contantHead otc_-table_-header">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>S.no</th>
                <th>Test name</th>
                <th>document name</th>
                <th style={{ textAlign: "center" }}>Open document / delete</th>
              </tr>
            </thead>
            <tbody className="otc_-table_-tBody">
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan="6">No Document found.</td>
                </tr>
              ) : (
                displayData.map((item, index) => (
                  <tr
                    key={item.document_Id}
                    className={
                      item.document_Id % 2 === 0 ? "evenRow" : "oddRow"
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.document_Id)}
                        onChange={() =>
                          handleSingleCheckboxChange(item.document_Id)
                        }
                      />
                    </td>
                    <td>{index + 1 + pageNumber * usersPerPage}</td>
                    <td> {item.TestName}</td>
                    <td>{item.documen_name}</td>
                    <td>
                      <div className="EditDelete_-btns">
                        <Link
                          className="Ots_-edit "
                          to={`/getSubjectData/${item.testCreationTableId}/${item.subjectId}/${item.sectionId}`}
                        >
                          Open Document
                        </Link>

                        <button
                          className="Ots_-delete"
                          onClick={() => handleDelete(item.document_Id)}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {selectedIds.length > 0 && (
            <div>
              <button onClick={handleDeleteSelected}>Delete Selected</button>
            </div>
          )}
          <ReactPaginate
            previousLabel={<i className="fa-solid fa-angles-left"></i>}
            nextLabel={<i className="fa-solid fa-angles-right"></i>}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />

        </div>
      </div>
    </div>
  );
};
