import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/details";

export const meta = () => ([
    {title: 'Resumo | Review'},
    {name: 'description', content: 'Detailed overview of your resume'},
])

const Resume = () => {
    const {auth, isLoading, fs, kv} = usePuterStore();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('')
    const [feedBack, setFeedBack] = useState<Feedback | null>(null)
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);


    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if (!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedBack(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback});
        }

        loadResume();
    }, [id]);
    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link className="back-button" to="/">
                    <img src="/icons/back.svg" alt="back-button" className="size-2.5"/>
                    <span className="text-gray-800 text-sm font-semibold">Back To Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section
                    className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-100vh sticky top-0 item-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div
                            className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noreferrer noopener">
                                <img src={imageUrl} alt="resume" className="size-full object-contain rounded-2xl "/>
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl text-black font-bold">Resume Review</h2>
                    {feedBack ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedBack={feedBack}/>
                            <ATS score={feedBack.ATS.score || 0} suggestion={feedBack.ATS.tips || []}/>
                            <Details feedback={feedBack}/>
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full"/>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Resume;