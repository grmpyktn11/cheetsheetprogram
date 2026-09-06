import { useState } from "react";
import Alarm from "./Alarm";
import logo from './assets/study.gif'
import load from './assets/load.gif'
import panic from './assets/panic.gif'

// Point at a local backend with VITE_API_BASE in frontend/.env.local, e.g.
// VITE_API_BASE=http://localhost:5000 - otherwise this falls through to the
// deployed backend, which is what a production build should use.
const API_BASE = import.meta.env.VITE_API_BASE ?? "https://kmoosa.pythonanywhere.com";


function FileUpload() {
    const [file, setFile] = useState(null);
    const [alarm,setAlarm] = useState(0);
    const [pFile, setPfile] = useState(null);
    const [picture, setPicture] = useState(logo)
    let meow = false;


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
            setFile(null);
            setAlarm(1);
            setPicture(panic)
        } else {
            setFile(file);
        }
    };

    const handleUpload = async () => {
        setPicture(load)
        if (!file) {
            setAlarm(2);
            setPicture(panic)
            return;
        }

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Send the file to the Flask server
            const response = await fetch(`${API_BASE}/upload`, {
                method: "POST",
                body: formData,
            });
            
            if (response.ok) {
                const data = await response.json();
                setPfile(`data:application/pdf;base64,${data.pdfEncoded}`);            
                setAlarm(4)
                setPicture(logo)
                

            } else {
                alert("Failed to upload file.");
                setPicture(panic)
                setAlarm(3);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
            setAlarm(3)
            setPicture(panic)
        }
        setPicture(logo)
    };

    return (
    
        <>

        <div className="mt-1 ml-2">
        <Alarm problem={alarm}/>
        </div>

        <div className="flex justify-center mt-20 h-80">
        <img src={picture} alt='logo' style={{ maxWidth: '400px', maxHeight: '500px'}}></img>
        </div>
        <div className="flex flex-col items-center justify-center h-70">
            
            <h1 className="font-[1000] text-3xl p-4">Upload your file here</h1>
            <h1 className="font-[100] pb-3">Welcome to CheetSheet! This is an app which allows you to make your powerpoints into quick notes! </h1>
            <input
                onChange={handleFileChange}
                type="file"
                accept=".pptx"
                className="file-input file-input-primary"
            />
           <button
                onClick={handleUpload}
                className="btn btn-error mt-4 text-[20px] mr-5 pl-8 pr-8"
            >
                Send
            </button>
            
        </div>
        <div className="flex justify-center">
        <iframe src={pFile} height='900px' width='1200px' title="CheetSheet"> whadddup </iframe>
        </div>
        </>
    );
}

export default FileUpload;