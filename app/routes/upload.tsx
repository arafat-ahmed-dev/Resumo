import React, {useState} from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";

const Upload = () => {
    const [isProccessing, setisProccessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;
        const formData = new FormData(form);
        const companyName = formData.get("company-name");
        const jobTitle = formData.get("job-title");
        const jobDescription = formData.get("job-description");
        console.log({companyName, jobTitle, jobDescription, file});

    }
    return (
        <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
            <Navbar/>
            <section className="main-section">
                <div className="page-heading px-5 py-8">
                    <h1>Smart Feedback For Your Job</h1>
                    {isProccessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" alt={statusText}/>
                        </>
                    ) : (
                        <h2>Drop your Resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProccessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">
                                    Company Name
                                </label>
                                <input id="company-name" type="text" name="company-name"
                                       placeholder="Company Name"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">
                                    Job Title
                                </label>
                                <input id="job-title" type="text" name="job-title"
                                       placeholder="Job Title"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">
                                    Job Description
                                </label>
                                <textarea id="job-description" rows={5} name="job-description"
                                          placeholder="Job Description"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploaderr">
                                    Uploader
                                </label>
                                <FileUploader onFileSelect={handleFileSelect}/>
                            </div>
                            <button type="submit" className="primary-button">Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Upload;