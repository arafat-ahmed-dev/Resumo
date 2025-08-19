import React, {useState} from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdfToImage";
import {prepareInstructions} from "../../constants";
import {generateUUID} from "~/lib/utils";

interface HandleAnalyzeProps {
    companyName: string,
    jobTitle: string,
    jobDescription: string,
    file: File

}

const Upload = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProccessing, setIsProccessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // useEffect(() => {
    //     if (!auth.isAuthenticated) navigate('/auth?next=/');
    // }, [auth.isAuthenticated])

    const handleFileSelect = (file: File | null) => setFile(file);
    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}: HandleAnalyzeProps) => {
        setIsProccessing(true);
        setStatusText("Uploading file...");
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText("Failed to upload file.");

        setStatusText("Converting to image...");
        const imageFile = await convertPdfToImage(file);
        if (!imageFile) return setStatusText("Failed to convert pdf to image.");

        setStatusText("Uploading the image...");
        console.log(imageFile)
        // @ts-ignore
        const uploadedImage = await fs.upload([imageFile.file]);

        if (!uploadedImage) return setStatusText("Failed to upload image.");

        setStatusText("Preparing data...");
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName: companyName,
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            feedback: ""
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analyzing....");

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
        )
        console.log(feedback)
        if (!feedback) return setStatusText("Failed to get feedback.");
        const feedbackText = typeof feedback.message.content === "string"
            ? feedback.message.content
            : feedback.message.content[0];

        data.feedback = JSON.stringify(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analysis completed , redirecting...");
        console.log(data);
        navigate(`/resume/${uuid}`);
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;
        const formData = new FormData(form);
        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if (!file) return;
        handleAnalyze({companyName, jobTitle, jobDescription, file})
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