import React, { useState, useEffect } from "react";
import "./styles/DocumentUpload_admin.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import { FaSearch } from "react-icons/fa";
const DocumentUpload_admin = () => {
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [file, setFile] = useState(null);
  const { testCreationTableId, sectionId } = useParams();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [documentData, setDocumentData] = useState([]);
  const filteredDocument = data.filter(
    (data) =>
      data.documen_name &&
      data.documen_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filteredData = filteredDocument.filter((data) =>
    data.TestName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset current page to 1 when search query changes
  };
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

  useEffect(() => {
    // Fetch tests data
    fetch(`${BASE_URL}/DocumentUpload/tests`)
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
        `${BASE_URL}/DocumentUpload/subjects/${testCreationTableId}`
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
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });

    // setSubmitting(false);
    //   }
  };

  return (
    <div
      className=" create_exam_container otsMainPages"
      style={{ height: "100vh" }}
    >
      <div className="" style={{ margin: "10px 0" }}>
        <h2 className="textColor">Document Upload Form </h2>
      </div>
      <form>
        <div className="uploadedDocument_container examSubjects_-contant">
          <div className="uploadedDocumentFilds">
            <label htmlFor="testSelect">Select Test:</label>
            <select
              id="testSelect"
              onChange={handleTestChange}
              value={selectedTest}
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
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
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
            <input
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              id="uploadInputFile_ovl_upload_file"
            />
          </div>
        </div>

        <div className="uploadedDocumentFilds" style={{ float: "right" }}>
          <button className="ots_-createBtn" onClick={(e) => handleUpload(e)}>
            Upload
          </button>
        </div>
        <div></div>
      </form>

      {/* document info section */}
      {/* <UploadedDoc /> */}

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
                  <td style={{ textAlign: "center" }}>S.no</td>
                  <td style={{ textAlign: "center" }}>Test name</td>
                  <td style={{ textAlign: "center" }}>document name</td>
                  <td style={{ textAlign: "center" }}>
                    Open document / delete
                  </td>
                </tr>
              </thead>
              <tbody className="otc_-table_-tBody">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6">No Document found.</td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.document_Id}
                      className={index % 2 === 0 ? "evenRow" : "oddRow"}
                    >
                      <td style={{ textAlign: "center" }}>{index + 1}</td>
                      <td style={{ padding: 10 }}> {item.TestName}</td>
                      <td style={{ padding: 10 }}>{item.documen_name}</td>
                      <td>
                        <div className="EditDelete_-btns">
                          <Link
                            className="Ots_-edit "
                            to={`/getSubjectData/${item.testCreationTableId}/${item.subjectId}/${item.sectionId}`}
                            style={{
                              background: "#00aff0",
                              color: "#fff",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            Open Document
                          </Link>

                          <button
                            className="Ots_-delete"
                            onClick={() => handleDelete(item.document_Id)}
                            style={{ background: "rgb(220 53 69)" }}
                          >
                            <i
                              className="fa-regular fa-trash-can"
                              style={{ color: "#fff" }}
                            ></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload_admin;
