import React, { useEffect, useState } from "react";
// import "./header.css";
import axios from 'axios'
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import BASE_URL from "../../../../apiConfig";
import { useParams } from "react-router-dom";

const BHPNavBarEdit = ({ type }) => {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editNavItemText, setEditNavItemText] = useState('');
  const [editnavItemlink, setEditnavItemlink] = useState('');
  const [navItems, setNavItems] = useState([]);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [editItemOrder, setEditItemOrder] = useState('');
  const [navItem, setNavItem] = useState('');
  const [itemOrder, setItemOrder] = useState('');
  const [navItemlink, setNavItemlink] = useState('');
  const [marqueeItems, setMarqueeItems] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [marqueeData, setMarqueeData] = useState("");
  const [showTextArea, setShowTextArea] = useState(false);
  const { Branch_Id } = useParams();

  const fetchMarqueeItems = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/BHPNavBar/homepage_marqueedisply/${Branch_Id}`
      );
      setMarqueeItems(response.data);
    } catch (error) {
      console.error("Error fetching marquee items:", error);
    }
  };

  const handlemarqueeSubmit = async () => {
    try {
      const dataToSend = {
        Marquee_data: marqueeData,
        Branch_Id: selectedBranch,
      };

      await axios.post(`${BASE_URL}/BHPNavBarEdit/homepage_marquee`, dataToSend);
      alert("Marquee data saved successfully!");
      setShowTextArea(false);
      fetchMarqueeItems();
    } catch (error) {
      console.error("Error saving marquee data:", error);
    }
  };

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/BHPNavBar/homepageNavItems`
        );
        if (response.data.status === "Success") {
          setNavItems(response.data.navItems);
          console.log("Nav items:", response.data.navItems);
        } else {
          console.error("Failed to fetch nav items");
        }
      } catch (error) {
        console.error("Error fetching nav items:", error);
      }
    };

    fetchNavItems();
  }, []);

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/BHPNavBarEdit/homepageNavItems/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert("Navbar Item deleted successfully!"); // Move alert here
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  

  const handleInputChange = (e) => {
    setNavItem(e.target.value);
  };




  const handleSave = async (id) => {
    try {
      await axios.put(`${BASE_URL}/BHPNavBarEdit/homepageNavItem/${id}`, {
        Nav_Item: editNavItemText,
        Item_Order: editItemOrder,
        navItemlink: editnavItemlink
      });
      
      // Update the state with the new item values
      setNavItems(navItems.map(item => 
        item.Nav_id === id 
          ? { ...item, Nav_Item: editNavItemText, Item_Order: editItemOrder, navItemlink: editnavItemlink } 
          : item
      ));
      
      // Clear the editing state
      setEditingItemId(null);
      setEditNavItemText('');
      setEditItemOrder('');
      setEditnavItemlink('');
      
      // Display the alert
      alert("Navbar item updated successfully!");
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  

  const handleSaveNavItem = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/BHPNavBarEdit/homepageNavItem`, {
        Nav_Item: navItem,
        Item_Order: itemOrder,
        navItemlink: navItemlink
      });
      console.log('Server Response:', response.data);
      
      if (response.data.status === 'Success') {
        console.log('Item saved successfully');
        alert("Navbar item added successfully!"); // Display alert here
  
        // Optionally close the form or reset form fields
        setNavItem('');
        setItemOrder('');
        setNavItemlink('');
      } else {
        console.error('Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };
  
  const [openNavItemsPopup, setOpenNavItemsPopup] = useState(false);
  const togglePopup = (type) => {
    if (type === 'navItemsPopup') {
      setOpenNavItemsPopup(prevState => !prevState);
      setIsNavbarOpen(false);
    } else if (type === 'navbarPopup') {
      setIsNavbarOpen(prevState => !prevState);
      setOpenNavItemsPopup(false);
    }
  };
  useEffect(() => {
    fetchAllBranches();
  }, []);

  const fetchAllBranches = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/BHPNavBar/branches`);
      console.log("Fetched data:", response.data); // Log fetched data
      setBranches(response.data); // Set state with fetched data
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  // Log branches after state update
  useEffect(() => {
    console.log("Branches updated:", branches);
  }, [branches]);


  const preFillMarqueeData = async () => {
    if (!selectedBranch) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/UgHomePage/homepage_marquee/${selectedBranch}`
      );
      if (response.data && response.data.length > 0) {
        setMarqueeData(response.data[0].Marquee_data);
      } else {
        setMarqueeData("");
      }
    } catch (error) {
      console.error("Error pre-filling marquee data:", error);
    }
  };

  useEffect(() => {
    preFillMarqueeData();
  }, [selectedBranch]);
  return (
    <div className="ug_header">

      {type === "Add NavItems" && (
        <div className="editCard">
          <div className="editCardBody">
            <input
              type="text"
              value={navItem}
              onChange={(e) => setNavItem(e.target.value)}
              placeholder="Enter NavItem"
            />
            <input
              type="text"
              value={itemOrder}
              onChange={(e) => setItemOrder(e.target.value)}
              placeholder="Enter Item Order"
            />
            <input
              type="text"
              value={navItemlink}
              onChange={(e) => setNavItemlink(e.target.value)}
              placeholder="Enter NavItem Link"
            />
            <button onClick={handleSaveNavItem}>Save</button>
          </div>

          <ul>
            {navItems.map(navItem => (
              <div key={navItem.Nav_id} style={{ display: 'flex', alignItems: 'center' }}>
                {editingItemId === navItem.Nav_id ? (
                  <>
                    <input
                      type="text"
                      value={editNavItemText}
                      onChange={(e) => setEditNavItemText(e.target.value)}
                      autoFocus
                    />
                    <input
                      type="number"
                      value={editItemOrder}
                      onChange={(e) => setEditItemOrder(e.target.value)}
                    />
                    <input
                      type="number"
                      value={editNavItemText}
                      onChange={(e) => setEditnavItemlink(e.target.value)}
                    />

                    <button onClick={() => handleSave(navItem.Nav_id)}>Save</button>
                    <button onClick={() => {
                      setEditingItemId(null);
                      setEditNavItemText('');
                      setEditItemOrder('');
                      setEditnavItemlink('');
                    }}>Cancel</button>
                  </>
                ) : (
                  <li>
                    {navItem.Nav_Item}
                  </li>
                )}
                <span className="deleteIcon" onClick={() => handleDelete(navItem.Nav_id)}>
                  <RiDeleteBin6Line />
                </span>
                <span
                  style={{ color: 'black' }}
                  onClick={() => {
                    setEditingItemId(navItem.Nav_id);
                    setEditNavItemText(navItem.Nav_Item);
                    setEditItemOrder(navItem.Item_Order);
                    setEditnavItemlink(navItem.navItemlink)
                  }}
                >
                  <CiEdit />
                </span>
              </div>
            ))}
          </ul>
        </div>
      )}



      {type === "Update_Marquee_tag" && (

        <div>
         <select
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
      >
        <option value="">Select Branch</option>
        {branches.length > 0 ? (
          branches.map((branch) => (
            <option key={branch.Branch_Id} value={branch.Branch_Id}>
              {branch.Branch_Name}
            </option>
          ))
        ) : (
          <option disabled>No branches available</option>
        )}
      </select>
          <textarea
            value={marqueeData}
            onChange={(e) => setMarqueeData(e.target.value)}
            placeholder="Enter marquee data"
            rows={10}
            cols={110}
          />
       

          <button onClick={handlemarqueeSubmit}>Submit</button>
        </div>
      )}

    </div>
  );
};
export default BHPNavBarEdit;