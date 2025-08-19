import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({resume}: { resume: Resume }) => {
    const [resumeUrl, setResumeUrl] = useState("")
    const {fs} = usePuterStore();

    useEffect(() => {
        const loadResume = async () => {
            setResumeUrl("")
            const blob = await fs.read(resume.imagePath);
            if (!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }
        loadResume().then(loadResume);
    }, [resume.imagePath])
    return (

        <Link
            className="resume-card animate-in fade-in duration-1000 "
            to={`/resume/${resume.id}`}
        >
            <div className="resume-card-header px-2">
                <div className="flex flex-col gap-2 max-w-[80%]">
                    <h2
                        className="text-black font-bold break-words truncate"
                        title={resume.companyName}
                    >
                        {resume.companyName}
                    </h2>
                    <h3
                        className="text-lg text-gray-500 break-words truncate"
                        title={resume.jobTitle}
                    >
                        {resume.jobTitle}
                    </h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={resume.feedback.overallScore}/>
                </div>
            </div>

            <div className="gradient-border fade-in duration-1000 animate-in">
                <div className="relative w-full h-[350px] max-sm:h-[200px]">
                    {!resumeUrl && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md"/>
                    )}
                    <img
                        src={resumeUrl}
                        alt="resumeUrl"
                        className={`w-full h-full object-cover object-top rounded-md transition-opacity duration-500 ${
                            !resumeUrl ? "opacity-0" : "opacity-100"
                        }`}
                    />
                </div>

            </div>
        </Link>


    );
}

export default ResumeCard;