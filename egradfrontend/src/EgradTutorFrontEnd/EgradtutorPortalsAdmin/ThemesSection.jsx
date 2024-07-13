import React, { useEffect, useState } from 'react'
import BASE_URL from '../../apiConfig';
import imgOrange from './styles/ThemesScreenShots/orangePreview.png'
import imgBlue from './styles/ThemesScreenShots/bluePreview.png'
import imgGreen from './styles/ThemesScreenShots/greenPreview.png'
import './styles/Themes.css'
import { IoMdClose } from "react-icons/io";
import AdminHeader from './AdminHeader';
const ThemesSection = () => {
    const [fetchedClasses, setFetchedClasses] = useState([]);
    const [activeDiv, setActiveDiv] = useState(null);
    const [previewTheme, setPreviewTheme] = useState(null);
    const [imgPreview, setImgPreview] = useState({ url: null, themeColor: null })
    useEffect(() => {
        const fetchThemeClasses = async () => {
            try {
                const response = await fetch(`${BASE_URL}/themesSection/getThemesClasses`);
                const jsonData = await response.json();
                setFetchedClasses(jsonData);
            } catch (error) {
                console.log(error, "error happened while fetching the data");
            }
        };
        fetchThemeClasses();
    }, []);

    useEffect(() => {
        console.log(fetchedClasses);
    }, [fetchedClasses]);

    const handleDivClick = async (sNo, theme) => {
        try {
            // Open the popup window
            // window.open('http://localhost:3000/oqbHomePage#QuizCourse', '_blank');

            // window.open('http://localhost:3000/orvlHomePage', '_blank');


            const response = await fetch(`${BASE_URL}/themesSection/postThemeFromAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sNo: sNo,
                    theme: theme
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not Ok");
            } else {
                console.log("response i got ", response);
                setActiveDiv(theme);
                const refreshChannel = new BroadcastChannel('refresh_channel');
                refreshChannel.postMessage('refresh_page');
            }
        } catch (error) {
            console.log(error, "Error while posting the data");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/themesSection/themeSelectedByAdmin`);
                if (!response.ok) {
                    throw new Error("error happened in the front end while getting the theme which was selected by admin");
                }
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                if (jsonResponse.length > 0) {
                    const currentActiveTheme = jsonResponse[0].current_theme;
                    setActiveDiv(currentActiveTheme);
                }
            } catch (error) {
                console.log("error while getting the themes selected by the admin");
            }
        };
        fetchData();

    }, []);
    const [imgToBeShown, setImgToBeShown] = useState(null)
    const handleImagePreview = (imgFromClick, theme) => {
        // setImgPreview(imgFromClick)
        console.log(imgFromClick);
        // setActiveDiv(theme);
        setImgPreview({ url: imgFromClick, themeColor: theme });
        setImgToBeShown(imgFromClick);

    }

    const handleClose = () => {
        setImgPreview("");
        setImgToBeShown("")
    }
    const handleApply = async () => {
        // Set activeDiv to the theme color of the currently previewed image
        setActiveDiv(imgPreview.themeColor);
        try {
            // Open the popup window
            // window.open('http://localhost:3000/oqbHomePage#QuizCourse', '_blank');

            // window.open('http://localhost:3000/orvlHomePage', '_blank');


            const response = await fetch(`${BASE_URL}/themesSection/postThemeFromAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // sNo: sNo,
                    theme: imgPreview.themeColor
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not Ok");
            } else {
                console.log("response i got ", response);
                // setActiveDiv(imgPreview.themeColor);
                const refreshChannel = new BroadcastChannel('refresh_channel');
                refreshChannel.postMessage('refresh_page');
            }
        } catch (error) {
            console.log(error, "Error while posting the data");
        }
        setImgPreview("")
        setImgToBeShown("");


    };
    return (
        // <>
        //     {/* <div>ThemesSection</div> */}
        //     <div className="create_exam_container otsMainPages">
        //         <div>
        //             <h3 className="textColor">Themes Section</h3>
        //         </div>

        //     </div>
        // </>
        <>
        <AdminHeader/>
            <div className="create_exam_container otsMainPages">
                <div>
                    <h3 className="textColor">Themes Section</h3>
                </div>

                <div className='theme-selector-container'>
                    <div className='theme-selector-flex'>
                        {fetchedClasses.map((fClass) => (
                            <div className='theme-selector-box' key={fClass.s_no}>
                                <div
                                    className={`theme-selector-card ${fClass.theme_color} ${fClass.theme_color === activeDiv ? 'active' : ''}`}
                                // onClick={() => handleDivClick(fClass.s_no, fClass.theme_color)}
                                >
                                    {/* <p>have to show images</p> */}
                                    {fClass.theme_color === 'Theme-2' && <img src={imgOrange} onClick={() => handleImagePreview(imgOrange, fClass.theme_color)} className='theme-selector-image' alt='themeImage' />}

                                    {fClass.theme_color === 'Theme-default' && <img src={imgBlue} onClick={() => handleImagePreview(imgBlue, fClass.theme_color)} className='theme-selector-image' alt='themeImage' />}
                                    {/* {fClass.theme_color === 'theme-purple' && <img src={img} onClick={() => handleImagePreview(img, fClass.theme_color)} className='theme-selector-image' alt='themeImage' />} */}
                                    {fClass.theme_color === 'Theme-1' && <img src={imgGreen} onClick={() => handleImagePreview(imgGreen, fClass.theme_color)} className='theme-selector-image' alt='themeImage' />}
                                    {/* {fClass.theme_color === 'theme-default' && <img src={imgDefault} onClick={() => handleImagePreview(imgDefault, fClass.theme_color)} className='theme-selector-image' alt='themeImage' />} */}
                                    {/* {fClass.theme_color === 'theme-white' && <img src={imgWhite} onClick={()=>handleImagePreview(imgWhite,fClass.theme_color)}className='theme-selector-image' alt='themeImage' />} */}
                                </div>
                                {fClass.theme_color === activeDiv && <span className="active-indicator"></span>}
                                {fClass.theme_color === activeDiv && <span className="active-text">Active</span>}
                            </div>

                        ))}
                    </div>
                    {imgToBeShown ? (
                        <div className='divToBeOpenedWhenPreviewed'>
                            <div className='parentDivForImg'>
                                <button onClick={handleClose} className='closeButtonInAdminTheme'>
                                <IoMdClose />
                                </button>
                                <img src={imgToBeShown} className='previewImg' alt="no img set to this :(" />
                                <div className='buttonsInPreviewDiv'>
                                    <button onClick={handleApply}>Apply</button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default ThemesSection