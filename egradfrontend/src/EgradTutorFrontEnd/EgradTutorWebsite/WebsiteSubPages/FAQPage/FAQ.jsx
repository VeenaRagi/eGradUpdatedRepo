import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import BASE_URL from "../../../../apiConfig";
// import FooterMain_Page from "../Footer_Admin/FooterMain_Page";
import FAQEdit from "./FAQEdit";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { AiFillPushpin } from "react-icons/ai";
import defaultImage from "../../../../assets/defaultImage.png";
import JSONClasses from "../../../../ThemesFolder/JSONForCSS/JSONClasses";
import { ThemeContext } from "../../../../ThemesFolder/ThemeContext/Context";
import "../../../../styles/Faqs/Default_FAQS.css";
import "../../../../styles/Theme1LinksPage.css";
import '../../../../styles/Theme2LinksPage.css';
import Footer from "../../Footer/Footer";
import { IoMdAdd } from "react-icons/io";
import ExamPageHeader from "../../ExamHomePage/ExamHomepageHeader/ExamPageHeader";
const FAQ = ({ isEditMode, userRole }) => {
  const [faqs, setFaqs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [image, setImage] = useState(null);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const themeFromContext = useContext(ThemeContext);

  useEffect(() => {
    fetchFaqs();
    fetchAnswers();
    fetchImage();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Faq/faqs`);
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs", error);
    }
  };
  const [openFAQId, setOpenFAQId] = useState(null);
  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Faq/answers`);
      setAnswers(response.data);
    } catch (error) {
      console.error("Error fetching answers", error);
    }
  };

  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleAnswer = (faqId) => {
    setOpenFAQId(prevId => (prevId === faqId ? null : faqId));
  };


  const fetchImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Logo/image`, {
        responseType: "arraybuffer",
      });
      const imageBlob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss");
  const themeDetails = JSONClasses[themeColor] || [];
  console.log(themeDetails, "mapppping from json....");
  const items = document.querySelectorAll(".accordion button");

  return (
    <>
      {/* ExamPageHeader */}
      <div
        className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`}
      >
        {image ? (
          <Link to="/">
            <img src={image} alt="Current" />
          </Link>
        ) : userRole === "user" ? (
          <p>
            Unable to load the image at the moment. Please try again later.
          </p>
        ) : userRole === "admin" ? (
          <p>No image available. Please upload the necessary image.</p>
        ) : (
          <p>
            Unable to load the image. Please contact support if this issue
            persists.
          </p>
        )}

        <span>
          <Link to={`/`}>
            <IoHome />
            Home
          </Link>
        </span>
      </div>
      <div className={`FaqMainContainer ${themeDetails.FaqMainContainer}`}>
        {/* <div
        className={`AboutUsImgContainer ${themeDetails.AboutUsImgContainer}`}
      >
        {image ? (
          <Link to="/">
            <img src={image} alt="Current" />
          </Link>
        ) : userRole === "user" ? (
          <p>Unable to load image at the moment. Please try again later.</p>
        ) : userRole === "admin" ? (
          <p>
            No data is available for this image. Please add the required data.
          </p>
        ) : (
          <p>
            Image could not be loaded. Please contact support if the issue
            persists.
          </p>
        )}

        <span>
          <Link to={`/`}>
            <IoHome />
            Home
          </Link>
        </span>
      </div> */}

        <div className={`FaqSubContainer ${themeDetails.FaqSubContainer}`}>
          <h1>FREQUENTLY ASKED QUESTIONS</h1>
          {isEditMode && (
          <button onClick={() => setShowFaqForm(!showFaqForm)}>
            {showFaqForm ? "Close FAQ Form" : "Add FAQ"}
          </button>
             )}
          {/* <button onClick={openAddForm} className="add-clicked"><FaRegPenToSquare /></button> */}

          <div className={`FaqDataContainer ${themeDetails.FaqDataContainer}`}>
            {showFaqForm && <FAQEdit type="aboutFaq" />}
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <div
                  key={faq.faq_id}
                  className={`FaqData ${themeDetails.FaqData}`}
                >

                  <h3 id={`faq_${faq.faq_id}`} onClick={() => toggleAnswer(faq.faq_id)}>
                    <div>
                      <AiFillPushpin />
                      {faq.faq_questions}
                    </div>
                    {/* <FaPlus /> */}
                  </h3>

                  {openFAQId === faq.faq_id && (
                    <p>{faq.faq_answer}</p>
                  )}
                </div>
              ))
            ) : userRole === "user" ? (
              <p>No FAQs are available at the moment. Please check back later.</p>
            ) : userRole === "admin" ? (
              <p>No FAQs available. Please add the FAQs.</p>
            ) : (
              <p>
                No FAQs are available. Please contact support if this issue
                persists.
              </p>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
