
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import { Link, useParams } from "react-router-dom";
import FooterEdit from "./FooterEdit";
import JSONClasses from "../../../ThemesFolder/JSONForCSS/JSONClasses";
import { ThemeContext } from "../../../ThemesFolder/ThemeContext/Context";
import "../../../styles/Default_landingPage_styles.css";
import '../../../styles/Theme2_landingPage_styles.css'
import '../../../styles/Theme1_landingPage_styles.css'
import { FaFacebook } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { SiYoutube } from "react-icons/si";
import { ImLinkedin } from "react-icons/im";
import '../../../styles/Default_landingPage_styles.css'


const Footer = ({ isEditMode, userRole }) => {
  const [dataOne, setDataOne] = useState([]);
  const [dataTwo, setDataTwo] = useState([]);
  const [dataThree, setDataThree] = useState([]);
  const [footerLink, setFooterLink] = useState([]);
  const [footerLinkData, setFooterLinkData] = useState([]);
  const [FirstPopupVisible, setFirstPopupVisible] = useState(false);
  const [showFooterLinksData, setShowFooterLinksData] = useState(false);
  const [showPreviousLinksData, setShowPreviousLinksData] = useState(false);
  const [isContactUsSectionVisible, setIsContactUsSectionVisible] = useState(false);
  const [isCopyRightSectionVisible, setIsCopyRightSectionVisible] = useState(false);
  const [addeGRADTutorContent, setAddeGRADTutorContent] = useState(false);
  const [addContactUsContent, setAddContactUsContent] = useState(false);
  const themeFromContext = useContext(ThemeContext);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/Footer/landingfooterContentDataOne`)
      .then((res) => {
        setDataOne(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data from landing_page_one:", error);
      });
  }, []);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Footer/landingfooterContentDataTwo`
        );
        setDataTwo(response.data);
      } catch (error) {
        console.error("Error fetching data from landing_page_two:", error);
      }
    };

    fetchFooterData();
  }, []);

  useEffect(() => {
    const fetchFooterCopyWriteData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Footer/landingfooterContentDataThree`
        );
        setDataThree(response.data);
      } catch (error) {
        console.error("Error fetching data from landing_copyright:", error);
      }
    };

    fetchFooterCopyWriteData();
  }, []);

  useEffect(() => {
    fetchFooterLinks();
  }, []);


  const fetchFooterLinks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Footer/footerLinks`);
      setFooterLink(response.data);
    } catch (error) {
      console.error("Error fetching footer links:", error);
    }
  };


  useEffect(() => {
    const fetchFooterCopyWriteData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/Footer/landingfooterContentDataThree`
        );
        setDataThree(response.data);
      } catch (error) {
        console.error("Error fetching data from landing_copyright:", error);
      }
    };

    fetchFooterCopyWriteData();
  }, []);

  const themeColor = themeFromContext[0]?.current_theme;
  console.log(themeColor, "this is the theme json classesssssss")
  const themeDetails = JSONClasses[themeColor] || []
  console.log(themeDetails, "mapppping from json....")

// for refreshing page when admin selects a theme
const refreshChannel = new BroadcastChannel("refresh_channel");
refreshChannel.onmessage = function (event) {
  if (event.data === "refresh_page") {
    window.location.reload(); // Reload the page
  }
};


  return (
    <>
      {themeColor === 'Theme-2' &&
        <div className={`Footer_Main_Container ${themeDetails.themeFooterMainContainer}`}>
          <div className={`Footer_Sub_Container ${themeDetails.themeFooterSubContainer}`}>
            <div className={`Footer_Content_Main_Container ${themeDetails.themeFooterContentMainContainer}`}>
              <div className={`Footer_FirstContent__Container ${themeDetails.themeFooterFirstContentContainer}`}>
                <div className={`Footer_eGRADTtutor__Content ${themeDetails.themeFootereGRADTtutoContent}`}>
                  <div>
                    {isEditMode && (
                      <div>
                        <button className="toggle-button-container"
                          onClick={() =>
                            setAddeGRADTutorContent(!addeGRADTutorContent)
                          }
                        >
                          {addeGRADTutorContent
                            ? "Hide eGRADTtor Form"
                            : "Add GRADTtorData"}
                        </button>

                        {addeGRADTutorContent && (
                          <FooterEdit type="Add eGRADTutor" />
                        )}
                      </div>
                    )}
                    {isEditMode && (
                      <div>
                        <button
                          onClick={() =>
                            setFirstPopupVisible(!FirstPopupVisible)
                          }
                        >
                          {FirstPopupVisible
                            ? "Hide eGRADTtor Form"
                            : "EditeGRADTtorData"}
                        </button>

                        {FirstPopupVisible && <FooterEdit type="eGRADTutor" />}
                      </div>
                    )}
                  </div>
                  {dataOne.length > 0 ? (
                    dataOne.map((item, index) =>
                      index === 0 ? (
                        <div
                          key={item.Content_id}
                          className={`Footer_FirstContent ${themeDetails.themeFooterFirstContent}`}
                        >
                          <h2 id="Footer_Heading">
                            {item.content}
                          </h2>
                        </div>
                      ) : (
                        <p
                          className="new_landingfooter_conatinerfristpart_item"
                          key={item.Content_id}
                        >
                          {item.content}
                        </p>
                      )
                    )
                  ) : userRole === 'user' ? (
                    <p>No content is available at the moment. Please check back later.</p>
                  ) : userRole === 'admin' ? (
                    <p>There is no content available. Please update the content.</p>
                  ) : (
                    <p>No content is available. Please contact support if this issue persists.</p>
                  )}
                </div>
                <div className={`Footer_Links_Content ${themeDetails.themeFooterLinksContent}`}>
                  {isEditMode && (
                    <div>
                      <button
                        onClick={() =>
                          setShowFooterLinksData(!showFooterLinksData)
                        }
                      >
                        {showFooterLinksData ? "Hide Add Link" : "Add Link"}
                      </button>
                      {showFooterLinksData && (
                        <FooterEdit type="Add_Footer_Links" />
                      )}
                    </div>
                  )}
                  {isEditMode && (
                    <div>
                      <button
                        onClick={() =>
                          setShowPreviousLinksData(!showPreviousLinksData)
                        }
                      >
                        {showPreviousLinksData
                          ? "Hide Edit Links"
                          : "Edit Links"}
                      </button>
                      {showPreviousLinksData && (
                        <FooterEdit type="Update_Footer_Links" />
                      )}
                    </div>
                  )}
                  <ul>
                    {footerLink.length > 0 ? (
                      footerLink.map((item) => (
                        <li key={item.Link_Id}>
                          {item.footer_document_data ? (
                            <Link
                              to={{
                                pathname: `/linkpage/${item.Link_Id}`,
                                state: {
                                  footerDocumentData: item.footer_document_data,
                                },
                              }}
                            >
                              {item.Link_Item}
                            </Link>
                          ) : (
                            <Link to={item.Link_Routing_Data}>
                              {item.Link_Item}
                            </Link>
                          )}
                        </li>
                      ))
                    ) : userRole === 'user' ? (
                      <p>No links are available at the moment. Please check back later.</p>
                    ) : userRole === 'admin' ? (
                      <p>There are no links available. Please add the necessary links.</p>
                    ) : (
                      <p>No links are available. Please contact support if this issue persists.</p>
                    )}
                  </ul>
                </div>
              </div>
              <div className={`Footer_Contact_Us_Content ${themeDetails.themeFooterContactUsContent}`}>
                {isEditMode && (
                  <div>
                    <button
                      onClick={() =>
                        setAddContactUsContent(!addContactUsContent)
                      }
                      className="editbtn"
                    >
                      {addContactUsContent
                        ? "Hide ContactUs"
                        : "Add ContactUs Data"}
                    </button>
                    {addContactUsContent && <FooterEdit type="Add ContactUs" />}
                  </div>
                )}

                {isEditMode && (
                  <div>
                    <button
                      onClick={() =>
                        setIsContactUsSectionVisible(!isContactUsSectionVisible)
                      }
                      className="editbtn"
                    >
                      {isContactUsSectionVisible
                        ? "Hide ContactUs"
                        : "Edit ContactUs Data"}
                    </button>
                    {isContactUsSectionVisible && (
                      <FooterEdit type="ContactUs" />
                    )}
                  </div>
                )}
                {dataTwo.length > 0 ? (
                  dataTwo.map((item, index) =>
                    index === 0 ? (
                      <div
                        key={item.Content_id}
                        className={`Footer_ContactData ${themeDetails.themeFooterContactData}`}
                      >
                        <h2 className="new_landingfooter_conatinersecondpart_item">
                          {item.content_name}
                        </h2>
                      </div>
                    ) : (
                      <p
                        className="new_landingfooter_conatinersecondpart_item"
                        key={item.Content_id}
                      >
                        {item.content_name}
                      </p>
                    )
                  )
                ) : userRole === 'user' ? (
                  <p>No contact information is available at the moment. Please check back later.</p>
                ) : userRole === 'admin' ? (
                  <p>Contact information is currently missing. Please add the necessary details.</p>
                ) : (
                  <p>No contact information is available. Please contact support if this issue persists.</p>
                )}
              </div>
              <div className={`${themeDetails.themeFooterSMIcons}`}>
                <Link to='/'> <FaFacebook /></Link>
                <Link> <GrInstagram /></Link>
                <Link><SiYoutube /></Link>
                <Link><ImLinkedin /></Link>
              </div>
            </div>

            <div className={`Footer_Copywrite_Content_Container ${themeDetails.themeFooterCopywriteContentContainer}`}>

              {isEditMode && (
                <div>
                  <button
                    onClick={() =>
                      setIsCopyRightSectionVisible(!isCopyRightSectionVisible)
                    }
                    className="editbtn"
                  >
                    {isCopyRightSectionVisible
                      ? "Hide copywrite form"
                      : "Edit copywrite"}
                  </button>
                  {isCopyRightSectionVisible && (
                    <FooterEdit type="CopyWriteTable" />
                  )}
                </div>
              )}
              {dataThree.length > 0 ? (
                dataThree.map((item) => (
                  <li key={item.Content_id}>{item.content_name}</li>
                ))
              ) : userRole === 'user' ? (
                <p>No content available at the moment. Please check back later.</p>
              ) : userRole === 'admin' ? (
                <p>No content available. Please add the required content.</p>
              ) : (
                <p>No content available. Please contact support if this issue persists.</p>
              )}
            </div>
          </div>
        </div>
      }
      {themeColor === 'Theme-default' &&
        <div className={`Footer_Main_Container ${themeDetails.themeFooterMainContainer}`}>
          <div className={`Footer_Sub_Container ${themeDetails.themeFooterSubContainer}`}>
            <div className={`Footer_Content_Main_Container ${themeDetails.themeFooterContentMainContainer}`}>
              <div className={`Footer_FirstContent__Container ${themeDetails.themeFooterFirstContentContainer}`}>
                <div className={`Footer_eGRADTtutor__Content ${themeDetails.themeFootereGRADTtutoContent}`}>
                  <div className="Editable_buttons_footer">
                    {isEditMode && (
                      <div>
                        <button
                          onClick={() =>
                            setAddeGRADTutorContent(!addeGRADTutorContent)
                          }
                        >
                          {addeGRADTutorContent
                            ? "Hide eGRADTtor Form"
                            : "Add GRADTtorData"}
                        </button>
                        {addeGRADTutorContent && (
                          <FooterEdit type="Add eGRADTutor" />
                        )}
                      </div>
                    )}

                    {isEditMode && (
                      <div>
                        <button
                          onClick={() => setFirstPopupVisible(!FirstPopupVisible)}
                        >
                          {FirstPopupVisible
                            ? "Hide eGRADTtor Form"
                            : "EditeGRADTtorData"}
                        </button>
                        {FirstPopupVisible && <FooterEdit type="eGRADTutor" />}
                      </div>
                    )}
                  </div>




                  {dataOne.length > 0 ? (
                    dataOne.map((item, index) =>
                      index === 0 ? (
                        <div
                          key={item.Content_id}
                          className={`Footer_FirstContent ${themeDetails.themeFooterFirstContent}`}
                        >
                          <h2 id="Footer_Heading">
                            {item.content}
                          </h2>
                        </div>
                      ) : (
                        <p
                          className="new_landingfooter_conatinerfristpart_item"
                          key={item.Content_id}
                        >
                          {item.content}
                        </p>
                      )
                    )
                  ) : userRole === 'user' ? (
                    <p>No content available at the moment. Please check back later.</p>
                  ) : userRole === 'admin' ? (
                    <p>There is no data available. Please add the content.</p>
                  ) : (
                    <p>No content available. Please contact support if this issue persists.</p>
                  )}
                </div>
                <div className={`Footer_Links_Content ${themeDetails.themeFooterLinksContent}`}>

                  <div className="Editable_buttons_footer">
                    {isEditMode && (
                      <div>
                        <button
                          onClick={() =>
                            setShowFooterLinksData(!showFooterLinksData)
                          }
                        >
                          {showFooterLinksData ? "Hide Add Link" : "Add Link"}
                        </button>
                        {showFooterLinksData && (
                          <FooterEdit type="Add_Footer_Links" />
                        )}
                      </div>
                    )}

                    {isEditMode && (
                      <div>
                        <button
                          onClick={() =>
                            setShowPreviousLinksData(!showPreviousLinksData)
                          }
                        >
                          {showPreviousLinksData
                            ? "Hide Edit Links"
                            : "Edit Links"}
                        </button>
                        {showPreviousLinksData && (
                          <FooterEdit type="Update_Footer_Links" />
                        )}
                      </div>
                    )}
                  </div>


                  <ul>
                    {footerLink.length > 0 ? (
                      footerLink.map((item) => (
                        <li key={item.Link_Id}>
                          {item.footer_document_data ? (
                            <Link
                              to={{
                                pathname: `/linkpage/${item.Link_Id}`,
                                state: {
                                  footerDocumentData: item.footer_document_data,
                                },
                              }}
                            >
                              {item.Link_Item}
                            </Link>
                          ) : (
                            <Link to={item.Link_Routing_Data}>
                              {item.Link_Item}
                            </Link>
                          )}
                        </li>
                      ))
                    ) : userRole === 'user' ? (
                      <p>No links are available at the moment. Please check back later.</p>
                    ) : userRole === 'admin' ? (
                      <p>There are no links available. Please add the necessary links.</p>
                    ) : (
                      <p>No links are available. Please contact support if this issue persists.</p>
                    )}
                  </ul>
                </div>
              </div>
              <div className={`Footer_Contact_Us_Content ${themeDetails.themeFooterContactUsContent}`}>

                <div className="Editable_buttons_footer">
                  {isEditMode && (
                    <div>
                      <button
                        onClick={() =>
                          setAddContactUsContent(!addContactUsContent)
                        }
                        className="editbtn"
                      >
                        {addContactUsContent
                          ? "Hide ContactUs"
                          : "Add ContactUs Data"}
                      </button>
                      {addContactUsContent && <FooterEdit type="Add ContactUs" />}
                    </div>
                  )}

                  {isEditMode && (
                    <div>
                      <button
                        onClick={() =>
                          setIsContactUsSectionVisible(!isContactUsSectionVisible)
                        }
                        className="editbtn"
                      >
                        {isContactUsSectionVisible
                          ? "Hide ContactUs"
                          : "Edit ContactUs Data"}
                      </button>
                      {isContactUsSectionVisible && (
                        <FooterEdit type="ContactUs" />
                      )}
                    </div>
                  )}
                </div>

                {dataTwo.length > 0 ? (
                  dataTwo.map((item, index) =>
                    index === 0 ? (
                      <div
                        key={item.Content_id}
                        className={`Footer_ContactData ${themeDetails.themeFooterContactData}`}
                      >
                        <h2 className="new_landingfooter_conatinersecondpart_item">
                          {item.content_name}
                        </h2>
                      </div>
                    ) : (
                      <p
                        className="new_landingfooter_conatinersecondpart_item"
                        key={item.Content_id}
                      >
                        {item.content_name}
                      </p>
                    )
                  )
                ) : userRole === 'user' ? (
                  <p>No contact information available at the moment. Please check back later.</p>
                ) : userRole === 'admin' ? (
                  <p>No contact information is available. Please update the details.</p>
                ) : (
                  <p>No contact information available. Please contact support if this issue persists.</p>
                )}
              </div>



            </div>


            <div className={`${themeDetails.themeFooterSMIcons}`}>
              <Link to='/'> <FaFacebook /></Link>
              <Link> <GrInstagram /></Link>
              <Link><SiYoutube /></Link>
              <Link><ImLinkedin /></Link>
            </div>

            <div className={`Footer_Copywrite_Content_Container ${themeDetails.themeFooterCopywriteContentContainer}`}>

              {isEditMode && (
                <div>
                  <button
                    onClick={() =>
                      setIsCopyRightSectionVisible(!isCopyRightSectionVisible)
                    }
                    className="editbtn"
                  >
                    {isCopyRightSectionVisible
                      ? "Hide copywrite form"
                      : "Edit copywrite"}
                  </button>
                  {isCopyRightSectionVisible && (
                    <FooterEdit type="CopyWriteTable" />
                  )}
                </div>
              )}

              {dataThree.length > 0 ? (
                dataThree.map((item) => (
                  <li key={item.Content_id}>{item.content_name}</li>
                ))
              ) : userRole === 'user' ? (
                <p>No items available at the moment. Please check back later.</p>
              ) : userRole === 'admin' ? (
                <p>No items found. Please add the required content.</p>
              ) : (
                <p>No items available. Please contact support if this issue persists.</p>
              )}
            </div>



          </div>
        </div>
      }

      {themeColor === 'Theme-1' &&
        <div className={`pg-footer ${themeDetails.themeMainFooterContainer}`}>
          <footer className={`footer ${themeDetails.themeInnerMainFooterContainer}`}>
            <svg class="footer-wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path class="footer-wave-path" d="M851.8,100c125,0,288.3-45,348.2-64V0H0v44c3.7-1,7.3-1.9,11-2.9C80.7,22,151.7,10.8,223.5,6.3C276.7,2.9,330,4,383,9.8 c52.2,5.7,103.3,16.2,153.4,32.8C623.9,71.3,726.8,100,851.8,100z"></path>
            </svg>
            <div className={`footer-content ${themeDetails.themeInnerMainFooterContentContainer}`}>

              <div className={`footer-content-column ${themeDetails.themeInnerMainFooterContentColumnContainer}`}>
                <div className={`Footer_eGRADTtutor__Content ${themeDetails.themeFootereGRADTtutoContent}`}>

                  {isEditMode && (
                    <div>
                      <button
                        onClick={() =>
                          setAddeGRADTutorContent(!addeGRADTutorContent)
                        }
                      >
                        {addeGRADTutorContent
                          ? "Hide eGRADTtor Form"
                          : "Add GRADTtorData"}
                      </button>
                      {addeGRADTutorContent && (
                        <FooterEdit type="Add eGRADTutor" />
                      )}
                    </div>
                  )}


                  {isEditMode && (
                    <div>
                      <button
                        onClick={() => setFirstPopupVisible(!FirstPopupVisible)}
                      >
                        {FirstPopupVisible
                          ? "Hide eGRADTtor Form"
                          : "EditeGRADTtorData"}
                      </button>
                      {FirstPopupVisible && <FooterEdit type="eGRADTutor" />}
                    </div>
                  )}



                  {dataOne.length > 0 ? (
                    dataOne.map((item, index) =>
                      index === 0 ? (
                        <div
                          key={item.Content_id}
                          className={`Footer_FirstContent ${themeDetails.themeFooterFirstContent}`}
                        >
                          <h2 id="Footer_Heading">
                            {item.content}
                          </h2>
                        </div>
                      ) : (
                        <p
                          className="new_landingfooter_conatinerfristpart_item"
                          key={item.Content_id}
                        >
                          {item.content}
                        </p>
                      )
                    )
                  ) : userRole === 'user' ? (
                    <p>No content available at the moment. Please check back later.</p>
                  ) : userRole === 'admin' ? (
                    <p>There is no content available. Please add the necessary content.</p>
                  ) : (
                    <p>No content available. Please contact support if this issue persists.</p>
                  )}

                </div>
                <div className={`${themeDetails.themeFooterSMIcons}`}>
                  <Link to='/'> <FaFacebook /></Link>
                  <Link> <GrInstagram /></Link>
                  <Link><SiYoutube /></Link>
                  <Link><ImLinkedin /></Link>
                </div>
              </div>

            </div>
            <div className={`contact-content ${themeDetails.themeContactFooterContentContainer}`}>
              <div className={`footer-content-column ${themeDetails.themeFooterContentColumn}`}>

                <div className={`Footer_FirstContent__Container ${themeDetails.themeFooterFirstContentContainer}`}>
                  <div className={`Footer_Links_Content ${themeDetails.themeFooterLinksContent}`}>
                    {isEditMode && (
                      <div>
                        <button
                          onClick={() =>
                            setShowFooterLinksData(!showFooterLinksData)
                          }
                        >
                          {showFooterLinksData ? "Hide Add Link" : "Add Link"}
                        </button>
                        {showFooterLinksData && (
                          <FooterEdit type="Add_Footer_Links" />
                        )}
                      </div>
                    )}
                    {isEditMode && (
                      <div>
                        <button
                          onClick={() =>
                            setShowPreviousLinksData(!showPreviousLinksData)
                          }
                        >
                          {showPreviousLinksData
                            ? "Hide Edit Links"
                            : "Edit Links"}
                        </button>
                        {showPreviousLinksData && (
                          <FooterEdit type="Update_Footer_Links" />
                        )}
                      </div>
                    )}
                    <ul>
                      {footerLink.length > 0 ? (
                        footerLink.map((item) => (
                          <li key={item.Link_Id}>
                            {item.footer_document_data ? (
                              <Link
                                to={{
                                  pathname: `/linkpage/${item.Link_Id}`,
                                  state: {
                                    footerDocumentData: item.footer_document_data,
                                  },
                                }}
                              >
                                {item.Link_Item}
                              </Link>
                            ) : (
                              <Link to={item.Link_Routing_Data}>
                                {item.Link_Item}
                              </Link>
                            )}
                          </li>
                        ))
                      ) : userRole === 'user' ? (
                        <p>No links are available at the moment. Please check back later.</p>
                      ) : userRole === 'admin' ? (
                        <p>There are no links available. Please add the necessary links.</p>
                      ) : (
                        <p>No links are available. Please contact support if this issue persists.</p>
                      )}
                    </ul>

                  </div>
                </div>
              </div>
              <div className={`footer-content-column ${themeDetails.themeFooterContentColumn}`}>
                <div className={`Footer_Contact_Us_Content ${themeDetails.themeFooterContactUsContent}`}>
                  {isEditMode && (
                    <div>
                      <button
                        onClick={() =>
                          setAddContactUsContent(!addContactUsContent)
                        }
                        className="editbtn"
                      >
                        {addContactUsContent
                          ? "Hide ContactUs"
                          : "Add ContactUs Data"}
                      </button>
                      {addContactUsContent && (
                        <FooterEdit type="Add ContactUs" />
                      )}
                    </div>
                  )}
                  {isEditMode && (
                    <div>
                      <button
                        onClick={() =>
                          setIsContactUsSectionVisible(
                            !isContactUsSectionVisible
                          )
                        }
                        className="editbtn"
                      >
                        {isContactUsSectionVisible
                          ? "Hide ContactUs"
                          : "Edit ContactUs Data"}
                      </button>
                      {isContactUsSectionVisible && (
                        <FooterEdit type="ContactUs" />
                      )}
                    </div>
                  )}
                  {dataTwo.length > 0 ? (
                    dataTwo.map((item, index) =>
                      index === 0 ? (
                        <div
                          key={item.Content_id}
                          className={`Footer_ContactData ${themeDetails.themeFooterContactData}`}
                        >
                          <h2 className="new_landingfooter_conatinersecondpart_item">
                            {item.content_name}
                          </h2>
                        </div>
                      ) : (
                        <p
                          className="new_landingfooter_conatinersecondpart_item"
                          key={item.Content_id}
                        >
                          {item.content_name}
                        </p>
                      )
                    )
                  ) : userRole === 'user' ? (
                    <p>No contact information available at the moment. Please check back later.</p>
                  ) : userRole === 'admin' ? (
                    <p>Contact information is missing. Please update the details.</p>
                  ) : (
                    <p>No contact information available. Please contact support if this issue persists.</p>
                  )}
                </div>
              </div>

            </div>
            <div className="footer-last-heading">
            {dataThree.length > 0 ? (
                  dataThree.map((item) => (
                    <li key={item.Content_id}>{item.content_name}</li>
                  ))
                ) : userRole === 'user' ? (
                  <p>No content available at the moment. Please check back later.</p>
                ) : userRole === 'admin' ? (
                  <p>No content available. Please add the required content.</p>
                ) : (
                  <p>No content available. Please contact support if this issue persists.</p>
                )}
            </div>
          </footer>
        </div>
      }
    </>
  )
}
export default Footer;