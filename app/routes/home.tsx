import type {Route} from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {useEffect} from "react";

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
    const {auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated])

    return <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
        <Navbar/>
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Stop Playing Resume Roulette</h1>
                <h2>Our AI doesn't just read your resume—it reads the room. Get inside intel on what makes hiring
                    managers say 'YES' in 6 seconds.</h2>
            </div>
            {resumes.length > 0 && (
                <div className="resumes-section">
                    {resumes.map((resume, index) => (
                        <ResumeCard key={resume.id} resume={resume}/>
                    ))}
                </div>
            )}
        </section>
    </main>;
}
