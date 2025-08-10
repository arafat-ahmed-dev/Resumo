import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({resume}: { resume: Resume }) => {
    return (
        <Link className="resume-card animate-in fade-in duration-1000" to={`/resume/${resume.id}`}>
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="text-black font-bold break-words">
                        {resume.companyName}
                    </h2>
                    <h3 className="text-lg text-gray-500 break-words">
                        {resume.jobTitle}
                    </h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={resume.feedback.overallScore}/>
                </div>
            </div>
            <div className="gradient-border fade-in duration-1000 animate-in">
                <div className="size-full">
                    <img src={resume.imagePath} alt="resumeURl"
                         className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"/>
                </div>
            </div>
        </Link>
    );
}

export default ResumeCard;