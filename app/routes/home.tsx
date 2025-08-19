import type {Route} from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import React, {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
    return [
        {title: " Resumo - Where Resumes Meet Their Match ✨"},
        {
            name: "description",
            content: "Your resume's AI wingman. We decode what employers really want, eliminate the guesswork, and turn your CV into a job-magnet. Join 100K+ career warriors who landed their dream jobs."
        },
    ];
}

export default function Home() {
    const [resumes, setResumes] = useState<Resume[]>([])
    const [loading, setLoading] = useState(false)
    const {auth, kv} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])

    useEffect(() => {
        const loadResume = async () => {
            setLoading(true)
            const data = (await kv.list("resume:*", true)) as KVItem[];
            const parsedResumes = data?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))
            setResumes(parsedResumes)
            setLoading(false)
        }
        loadResume().then(loadResume)
    }, []);

    return <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
        <Navbar/>
        <section className="main-section">
            <div className="page-heading md:py-12 py-6">
                <h1>Stop Playing Resume Roulette</h1>
                {!loading && resumes?.length === 0 ? (
                    <h2>No resumes found. Upload your first resume to get feedback.</h2>
                ) : (
                    <h2>Our AI doesn't just read your resume—it reads the room. Get inside intel on what makes hiring
                        managers say 'YES' in 6 seconds.</h2>
                )}
            </div>
            {resumes.length > 0 && (
                <div className="resumes-section">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume}/>
                    ))}
                </div>
            )}
            {loading && (
                <div className="flex justify-center items-start">
                    <img src="/images/resume-scan-2.gif" alt="Scaning" className="w-1/2"/>
                </div>
            )}
            {!loading && resumes?.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-10 gap-4">
                    <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                        Upload Resume
                    </Link>
                </div>
            )}
        </section>
    </main>;
}
