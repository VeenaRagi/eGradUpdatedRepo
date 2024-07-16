
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const Doubtsection = ({ userId }) => {
// //   const [message, setMessage] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const [userData, setUserData] = useState({});

// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         const response = await fetch(
// //           "http://localhost:5001/ughomepage_banner_login/user",
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`, // Attach token to headers for authentication
// //             },
// //           }
// //         );

// //         if (response.ok) {
// //           const userData = await response.json();
// //           setUserData(userData);
// //         } else {
// //           // Handle errors, e.g., if user data fetch fails
// //         }
// //       } catch (error) {
// //         // Handle other errors
// //       }
// //     };

// //     fetchUserData();
// //   }, []);

// //   const sendMessage = async () => {
// //     try {
// //       await axios.post("http://localhost:5001/Doubtsection/send_message", {
// //         senderId: userData.id,
// //         studentcontent: message,
// //         senderusername: userData.username,
// //       });
// //       setMessage(""); // Clear the message after sending
// //     } catch (error) {
// //       console.error("Error sending message:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     const fetchMessages = async () => {
// //       // Ensure userData.id is set
// //       if (userData.id) {
// //         try {
// //           const response = await axios.get(
// //             `http://localhost:5001/Doubtsection/get_messages/${userData.id}`
// //           );
// //           setMessages(response.data.messages);
// //         } catch (error) {
// //           console.error("Error fetching messages:", error);
// //         }
// //       }
// //     };

// //     fetchMessages();
// //   }, [userData.id]); // Use userData.id as dependency

// //   const replyToUser = async (senderId) => {
// //     const replystudentcontent = prompt("Enter your reply:");
// //     if (replystudentcontent) {
// //       try {
// //         await axios.post("http://localhost:5001/Doubtsection/send_reply", {
// //           senderId: senderId,
// //           studentcontent: replystudentcontent,
// //           adminId: userData.id,
// //         });
// //         // Optionally, you can fetch updated messages after sending the reply
// //       } catch (error) {
// //         console.error("Error sending reply:", error);
// //       }
// //     }
// //   };
// //   return (
// //     <div>
// //       <div>
// //         <div>
// //           <h2>Messages</h2>
// //           <ul>
// //             {messages.map((message, index) => (
// //               <li key={index}>
// //                 <strong>Sender: {message.senderusername}</strong>
// //                 <p>{message.studentcontent}</p>
// //                 {/* Add a button to reply to the sender */}
// //                 {/* <button onClick={() => replyToUser(message.sender_id)}>
// //                   Reply
// //                 </button> */}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       </div>
// //       <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
// //       <button onClick={sendMessage}>Send Message</button>
// //     </div>
// //   );
// // };

// // export default Doubtsection;

// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const Doubtsection = () => {
//    const userRole = localStorage.getItem("userRole");

//   return (
//     <>
//       {userRole === "admin" && (
//         <div>
//           {/* <p>Admin View: Show all features</p> */}
//           {/* Admin-specific studentcontent goes here */}
//           <DisplaystudentsMessages />
//         </div>
//       )}
//       {userRole === "viewer" && (
//         <div>
//           {/* <p>Admin View: Show all features</p> */}
//           {/* Admin-specific studentcontent goes here */}
//           <DoubtSTudentsection />
//         </div>
//       )}
//     </>
//   );
// };



// export default Doubtsection



// export const DoubtSTudentsection = () => {
//    const [message, setMessage] = useState("");
//    const [messages, setMessages] = useState([]);
//    const [userData, setUserData] = useState({});
//    useEffect(() => {
//      const fetchUserData = async () => {
//        try {
//          const token = localStorage.getItem("token");
//          const response = await fetch(
//            "http://localhost:5001/ughomepage_banner_login/user",
//            {
//              headers: {
//                Authorization: `Bearer ${token}`, // Attach token to headers for authentication
//              },
//            }
//          );

//          if (response.ok) {
//            const userData = await response.json();
//            setUserData(userData);
//          } else {
//            // Handle errors, e.g., if user data fetch fails
//          }
//        } catch (error) {
//          // Handle other errors
//        }
//      };

//      fetchUserData();
//    }, []);

//    const sendMessage = async () => {
//      try {
//        if (!userData.id) {
//          console.error("Error: userData.id is null or undefined");
//          return;
//        }

//        await axios.post("http://localhost:5001/Doubtsection/send_message", {
//          senderId: userData.id,
//          studentcontent: message,
//          senderUsername: userData.username,
//        });
//        setMessage(""); // Clear the message after sending
//      } catch (error) {
//        console.error("Error sending message:", error);
//      }
//    };

//    const fetchMessages = async () => {
//      try {
//        const response = await axios.get(
//          `http://localhost:5001/Doubtsection/get_messages/${userData.id}`
//        );
//        setMessages(response.data.messages);
//      } catch (error) {
//        console.error("Error fetching messages:", error);
//      }
//    };

//    useEffect(() => {
//      fetchMessages();
//    }, [userData.id]);
//   return (
//  <div>
//       <div>
//         <div>
//           <h2>Messages</h2>
//           <ul>
//             {messages.map((message, index) => (
//               <li key={index}>
//                 <strong>
//                   {userData.username}: {message.senderusername}
//                 </strong>
//                 <span>{message.studentcontent}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div>
//         <h2>Send Message</h2>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             sendMessage();
//           }}
//         >
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button type="submit">Send Message</button>
//         </form>
//       </div>
   
//     </div>
//   )
// }






// export const DisplaystudentsMessages = () => {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//  const [userData, setUserData] = useState({});
//  useEffect(() => {
//    const fetchUserData = async () => {
//      try {
//        const token = localStorage.getItem("token");
//        const response = await fetch(
//          "http://localhost:5001/ughomepage_banner_login/user",
//          {
//            headers: {
//              Authorization: `Bearer ${token}`, // Attach token to headers for authentication
//            },
//          }
//        );

//        if (response.ok) {
//          const userData = await response.json();
//          setUserData(userData);
//        } else {
//          // Handle errors, e.g., if user data fetch fails
//        }
//      } catch (error) {
//        // Handle other errors
//      }
//    };

//    fetchUserData();
//  }, []);



//     useEffect(() => {
//       axios
//         .get(`http://localhost:5001/Doubtsection/get_users/${userData.id}`)
//         .then((res) => {
//           setUsers(res.data);
//           console.log(users);
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     }, []);

//  const handleUsernameClick = async (userId) => {
//    try {
//      const response = await axios.get(
//        `http://localhost:5001/Doubtsection/get_user_messages/${userId}`
//      );
//      console.log("Response:", response);
//      setMessages(response.data.userMessages);
//      console.log(userId);
//    } catch (error) {
//      console.error("Error fetching user messages:", error);
//    }
//  };

//   // const handleReply = async (messageId) => {
//   //   try {
//   //     // Assuming you have an API endpoint to handle replies
//   //     const response = await axios.post(
//   //       "http://localhost:5001/Doubtsection/send_reply",
//   //       {
//   //         messageId,
//   //         studentcontent: replystudentcontent,
//   //       }
//   //     );

//   //     // Fetch updated messages after sending the reply
//   //     const updatedResponse = await axios.get(
//   //       "http://localhost:5001/Doubtsection/get_user_messages"
//   //     );
//   //     setMessages(updatedResponse.data.userMessages);

//   //     console.log(response.data); // Log the reply response
//   //   } catch (error) {
//   //     console.error("Error sending reply:", error);
//   //   }
//   // };

//   return (
//     <div>
//       <h1>DisplaystudentsMessages</h1>
//       <h2>User Messages</h2>
//       <div>
//         <div>
//           <ul>
//             {users &&
//               users.map((user) => (
//                 <li
//                   key={user.user_Id}
//                   onClick={() => handleUsernameClick(user.user_Id)}
//                   style={{ cursor: "pointer", textDecoration: "underline" }}
//                 >
//                   {user.username}
//                 </li>
//               ))}
//           </ul>
//         </div>
//         <div>
//           <ul>
//             {messages.map((message) => (
//               <li key={message.message_id}>
//                 <strong>Message ID: {message.message_id}</strong>
//                 <strong>User ID: {message.sender_id}</strong>
//                 <p>Username: {message.username}</p>
//                 <p>studentcontent: {message.studentcontent}</p>
//                 <p> {message.admin_content}</p>

//                 {/* <input
//                   type="text"
//                   value={replystudentcontent}
//                   onChange={(e) => setReplystudentcontent(e.target.value)}
//                   placeholder="Type your reply..."
//                 />
//                 <button onClick={() => handleReply(message.message_id)}>
//                   Reply
//                 </button> */}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };



// // const AdminReply = () => {
// //   const [users, setUsers] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [studentcontent, setstudentcontent] = useState("");

// //     useEffect(() => {
// //       axios
// //         .get("http://localhost:5001/Doubtsection/get_users")
// //         .then((res) => {
// //           setUsers(res.users);
// //           console.log(users);
// //         })
// //         .catch((error) => {
// //           console.error("Error fetching data:", error);
// //         });
// //     }, []);
// //   const sendReply = async () => {
// //     try {
// //       if (!selectedUser) {
// //         console.error("No user selected");
// //         return;
// //       }

// //       const adminId = 1; // Replace with the actual admin ID
// //       await axios.post("http://localhost:5001/Doubtsection/send_reply", {
// //         senderId: selectedUser.user_Id,
// //         studentcontent,
// //         adminId,
// //       });

// //       // Optionally, you can fetch updated messages or update the UI after sending the reply

// //       // Clear selected user and studentcontent
// //       setSelectedUser(null);
// //       setstudentcontent("");
// //     } catch (error) {
// //       console.error("Error sending reply:", error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <div>
// //         <h2>Users</h2>
// //         <ul>
// //           {users.map((user) => (
// //             <li key={user.user_Id} onClick={() => setSelectedUser(user)}>
// //               {user.username}
// //             </li>
// //           ))}
// //         </ul>
// //       </div>

// //       {selectedUser && (
// //         <div>
// //           <h2>Chat with {selectedUser.username}</h2>
// //           <div>
// //             {/* Display previous messages */}
// //             {/* You can fetch and display previous messages here */}
// //           </div>
// //           <form
// //             onSubmit={(e) => {
// //               e.preventDefault();
// //               sendReply();
// //             }}
// //           >
// //             <label>Reply studentcontent:</label>
// //             <input
// //               type="text"
// //               value={studentcontent}
// //               onChange={(e) => setstudentcontent(e.target.value)}
// //             />
// //             <button type="submit">Send Reply</button>
// //           </form>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };




import React from 'react'

const Doubtsection = () => {
  return <div>Doubtsection</div>;
}

export default Doubtsection
