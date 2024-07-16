import React, { useEffect, useState } from 'react';
import "./styles/BuyCourses.css";
import { FaRupeeSign } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import BASE_URL from "../../apiConfig";

const BuyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [userData, setUserData] = useState({});
  const [showAddedCourses, setShowAddedCourses] = useState(false);
  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/BuyCourses/DisplayCoursesForBuy`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        setCourses(data.courses);

      } else {
        console.error('Error fetching data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${BASE_URL}/ughomepage_banner_login/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Attach token to headers for authentication
              },
            }
          );
  
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
            console.log(userData);
          } else {
            // Handle errors, e.g., if user data fetch fails
          }
        } catch (error) {
          // Handle other errors
        }
      };
  
      fetchUserData();
    }, []);


    const handleBuyClick = async (courseCreationId) => {
        try {
          const response = await fetch(`${BASE_URL}/BuyCourses/buyCourses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userData.id,
              courseCreationId: courseCreationId,
            }),
          });
    
          if (response.ok) {
            console.log('Buy successful');
            // Update the userCourses state if needed
            setUserCourses([...userCourses, { user_id: userData.id, course_id: courseCreationId }]);
          } else {
            console.error('Failed to make a purchase');
          }
        } catch (error) {
          console.error('Error making a purchase:', error);
        }
      };

  const handleAddToCartClick = async (courseCreationId) => {
    // Check if the course is already in the cart
    const isCourseInCart = userCourses.some((userCourse) => userCourse.course_id === courseCreationId && userCourse.status === 'cart');
  
    if (isCourseInCart) {
      console.log(`Course ID ${courseCreationId} is already in the user's cart`);
    } else {
      // Implement logic for handling the "Add to Cart" button click
      console.log(`Add to Cart clicked for course ID ${courseCreationId}`);
      
      try {
        const response = await fetch(`${BASE_URL}/BuyCourses/addToCart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userData.id, 
            courseCreationId: courseCreationId,  
          }),
        });
  
        if (response.ok) {
          console.log('Added to cart successfully');
          // Update the userCourses state to reflect the change
          setUserCourses([...userCourses, { user_id:  userData.id, course_id: courseCreationId, status: 'cart' }]);
        } else {
          console.error('Failed to add to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleViewAddedCoursesClick = async () => {
    setShowAddedCourses(!showAddedCourses); // Toggle visibility
    if (showAddedCourses) {
      return; // If it's being closed, no need to fetch data
    }

    try {
      const response = await fetch(`${BASE_URL}/BuyCourses/addedCourses/${userData.id}`);
      if (response.ok) {
        const { courses } = await response.json();
        console.log('Fetched added courses:', courses);
        // Update the userCourses state with the fetched courses
        setUserCourses(courses);
      } else {
        console.error('Failed to fetch added courses');
      }
    } catch (error) {
      console.error('Error fetching added courses:', error);
    }
  };

   const handleViewAddedCoursesClickclose = async () => {
     setShowAddedCourses(!showAddedCourses); // Toggle visibility
     if (!showAddedCourses) {
       return; // If it's being closed, no need to fetch data
     }

     try {
       const response = await fetch(
         `${BASE_URL}/BuyCourses/addedCourses/${userData.id}`
       );
       if (response.ok) {
         const { courses } = await response.json();
         console.log("Fetched added courses:", courses);
         // Update the userCourses state with the fetched courses
         setUserCourses(courses);
       } else {
         console.error("Failed to fetch added courses");
       }
     } catch (error) {
       console.error("Error fetching added courses:", error);
     }
   };
    const handleViewAddedCoursesClick_close = async () => {
      setShowAddedCourses(!showAddedCourses); // Toggle visibility
      if (!showAddedCourses) {
        return; // If it's being closed, no need to fetch data
      }

      try {
        const response = await fetch(
          `${BASE_URL}/BuyCourses/addedCourses/${userData.id}`
        );
        if (response.ok) {
          const { courses } = await response.json();
          console.log("Fetched added courses:", courses);
          // Update the userCourses state with the fetched courses
          setUserCourses(courses);
        } else {
          console.error("Failed to fetch added courses");
        }
      } catch (error) {
        console.error("Error fetching added courses:", error);
      }
    };
;
  const handleDeleteFromCartClick = async (courseCreationId) => {
    try {
      const response = await fetch(`${BASE_URL}/BuyCourses/deleteFromCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.id,
          course_id: courseCreationId,
        }),
      
      });
      fetchData();
      if (response.ok) {
        console.log('Deleted from cart successfully');
        // Implement logic to update the UI or state if needed
      } else {
        console.error('Failed to delete from cart');
      }
    } catch (error) {
      console.error('Error deleting from cart:', error);
    }
    
  };

  return (
    <div className="student_dash_board_buycourses_container">
      <h3>Buy Courses</h3>

      <>
        <button
          className="student_dash_board_buycourse_cart"
          onClick={handleViewAddedCoursesClick}
        >
          {showAddedCourses ? (
            <i class="fa-solid fa-cart-shopping"></i>
          ) : (
            <i class="fa-solid fa-cart-shopping"></i>
          )}
        </button>
        {showAddedCourses && (
          <div className="student_dash_board_buycourses_add_tocart_cantioner">
            <div
              onClick={handleViewAddedCoursesClickclose}
              className="student_dash_board_buycourses_add_tocart_cantionerclose"
            >
              <VscChromeClose />
            </div>
            {userCourses.map((userCourse) => (
              <div
                className="student_dash_board_buycourses_card"
                key={userCourse.courseCreationId}
              >
                <div className="student_dash_board_buycourses_card_Img">
                  <img
                    src={userCourse.cardimeage}
                    alt={userCourse.courseName}
                  />
                </div>
                {/* <p>{userCourse.courseCreationId}</p> */}
                <h4>{userCourse.courseName}</h4>
                <div className="student_dash_board_buycourses_card_info_year">
                  <label>Year : </label>
                  <span>{userCourse.courseYear}</span>
                </div>
                <div className="student_dash_board_buycourses_card_info_year_date">
                  {userCourse.courseStartDate} to {userCourse.courseEndDate}
                </div>

                <div className="student_dash_board_buycourses_card_price_contanier">
                  <div>
                    <div className="student_dash_board_buycourses_card_info_discount">
                      {userCourse.Discount}%
                    </div>
                    <p className="student_dash_board_buycourses_card_info_totleprice">
                      Price:
                      {userCourse.cost}
                    </p>
                  </div>

                  <p className="student_dash_board_buycourses_card_info_discountprice">
                    <sup>
                      <FaRupeeSign />
                    </sup>
                    {userCourse.totalPrice}
                  </p>
                </div>

                <div className="student_dash_board_buycourses_card_btn_container">
                  <button
                    onClick={() => handleBuyClick(userCourse.courseCreationId)}
                  >
                    Buy Now
                  </button>
                  <button
                    id="Delete_from_Cart"
                    onClick={() =>
                      handleDeleteFromCartClick(userCourse.courseCreationId)
                    }
                  >
                    Delete from Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="student_dash_board_buycourses_card_container">
          {courses.map((course) => (
            <div
              className="student_dash_board_buycourses_card"
              key={course.courseCreationId}
            >
              {/* <p>{course.courseCreationId}</p> */}
              <div className="student_dash_board_buycourses_card_Img">
                <img src={course.cardimeage} alt={course.courseName} />
              </div>
              <div className="student_dash_board_buycourses_card_info">
                <h4>{course.courseName}</h4>
                <div className="student_dash_board_buycourses_card_info_year">
                  <label>Year : </label>
                  <span>{course.courseYear}</span>
                </div>
                <div className="student_dash_board_buycourses_card_info_year_date">
                  {course.courseStartDate} to {course.courseEndDate}
                </div>

                <div className="student_dash_board_buycourses_card_price_contanier">
                  <div>
                    <div className="student_dash_board_buycourses_card_info_discount">
                      {course.Discount}%
                    </div>
                    <p className="student_dash_board_buycourses_card_info_totleprice">
                      Price:
                      {course.cost}
                    </p>
                  </div>

                  <p className="student_dash_board_buycourses_card_info_discountprice">
                    <sup>
                      <FaRupeeSign />
                    </sup>
                    {course.totalPrice}
                  </p>
                </div>
              </div>
              <div className="student_dash_board_buycourses_card_btn_container">
                <button onClick={() => handleBuyClick(course.courseCreationId)}>
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCartClick(course.courseCreationId)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

export default BuyCourses;
