import React, { useState, useEffect } from 'react';
import BASE_URL from "../../../../apiConfig";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import '../../../../styles/Default_landingPage_styles.css'
const CoursePageHeaderEdit = ({type}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    order: ''
  });
  const [headers, setHeaders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/CoursePageHeaderEdit/getHeaderItems`);
        const data = await response.json();
        setHeaders(data);
      } catch (error) {
        console.error('Error fetching header items:', error);
      }
    };
    fetchHeaderData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editMode ? `${BASE_URL}/CoursePageHeaderEdit/updateHeaderItem/${editId}` : `${BASE_URL}/CoursePageHeaderEdit/saveHeaderItem`;
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`Header item ${editMode ? 'updated' : 'saved'} successfully`);
        setShowForm(false);
        setFormData({
          title: '',
          link: '',
          order: ''
        });
        setEditMode(false);
        setEditId(null);
        const updatedHeaders = await fetch(`${BASE_URL}/CoursePageHeaderEdit/getHeaderItems`).then(res => res.json());
        setHeaders(updatedHeaders);
      } else {
        alert(`Failed to ${editMode ? 'update' : 'save'} header item`);
      }
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'saving'} header item:`, error);
      alert(`An error occurred while ${editMode ? 'updating' : 'saving'} the header item`);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.HeaderItemName,
      link: item.HeaderItemLink,
      order: item.HeaderItemOrder
    });
    setEditMode(true);
    setEditId(item.HeaderItem_Id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/CoursePageHeaderEdit/deleteHeaderItem/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Header item deleted successfully');
        // Refetch data
        const updatedHeaders = await fetch(`${BASE_URL}/CoursePageHeaderEdit/getHeaderItems`).then(res => res.json());
        setHeaders(updatedHeaders);
      } else {
        alert('Failed to delete header item');
      }
    } catch (error) {
      console.error('Error deleting header item:', error);
      alert('An error occurred while deleting the header item');
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup by setting state to false
  };
  

  return (
    <div>
    {isPopupOpen && (
      <>
    <div>
    {type === "HeaderMenu" && (
     <div className="Blur_Effect_Mode">
      <div className="handleCloseBtn">
        <button className="HCbutton" onClick={handleClosePopup}>close</button>
      </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title:
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
              />
            </label>
          </div>
          <div>
            <label>
              Link:
              <input 
                type="text" 
                name="link" 
                value={formData.link} 
                onChange={handleInputChange} 
                required 
              />
            </label>
          </div>
          <div>
            <label>
              Order:
              <input 
                type="number" 
                name="order" 
                value={formData.order} 
                onChange={handleInputChange} 
                required 
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
        
        <div>
          <h2>Saved Header Items</h2>
          <ul>
            {headers.map((headeritem) => (
              <li key={headeritem.HeaderItem_Id}>
                {headeritem.HeaderItemName} - {headeritem.HeaderItemLink} - {headeritem.HeaderItemOrder}
                <button className = "Edit_button" onClick={() => handleEdit(headeritem)}><CiEdit /></button>
                <button className = "Delete_button"onClick={() => handleDelete(headeritem.HeaderItem_Id)}><RiDeleteBin6Line /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
  </>
    )}
    </div>
  );
};

export default CoursePageHeaderEdit;
