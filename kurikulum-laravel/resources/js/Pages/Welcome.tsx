import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Props {
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
}

export default function Welcome({ canLogin, canRegister }: Props) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-body text-gray-900 selection:bg-polman-primary selection:text-white pb-12">
            <Head title="Welcome to TRIN Portal" />

            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-xl tracking-wide text-polman-primary">TRIN Portal</span>
                    </div>

                    {/* Center Links (Hidden on Mobile) */}
                    <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600">
                        <a href="#" className="hover:text-polman-primary transition-colors border-b-2 border-transparent hover:border-polman-primary pb-1">Curriculum</a>
                        <a href="#" className="hover:text-polman-primary transition-colors">OBE Framework</a>
                        <a href="#" className="hover:text-polman-primary transition-colors">IABEE Compliance</a>
                        <a href="#" className="hover:text-polman-primary transition-colors">Partnerships</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {canLogin ? (
                            <>
                                <Link 
                                    href={route('login')} 
                                    className="text-sm font-bold text-polman-primary hover:text-polman-secondary transition-colors"
                                >
                                    Portal Login
                                </Link>
                                {canRegister && (
                                    <Link 
                                        href={route('register')} 
                                        className="bg-polman-primary hover:bg-polman-secondary text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-20 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                {/* Background Decoration (Abstract Graphic representation) */}
                <div className="absolute right-0 top-20 opacity-5 pointer-events-none w-1/2 h-full flex justify-end">
                    <svg viewBox="0 0 200 200" className="w-[600px] h-[600px]" fill="currentColor">
                        <path d="M100 0v200M0 100h200" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <rect x="60" y="60" width="80" height="80" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                </div>

                <div className="relative z-10 max-w-3xl">
                    <span className="inline-block bg-polman-primary/10 text-polman-primary px-4 py-1.5 rounded-full text-xs font-bold mb-8 tracking-widest uppercase border border-polman-primary/20">
                        ✨ IABEE Accredited Program
                    </span>
                    <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-gray-900 leading-[1.1] mb-6">
                        Engineering the <br/>
                        <span className="text-polman-primary italic">Future</span> of Education
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl font-medium">
                        Advanced OBE Management for Industrial Engineering Excellence. A digital blueprint for navigating the complex curriculum of POLMAN Bandung's TRIN program.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="bg-polman-primary hover:bg-polman-secondary text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-polman-primary/30 transform hover:-translate-y-1">
                            Explore Curriculum
                        </button>
                        <button className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold transition-all shadow-sm">
                            Learn About IABEE
                        </button>
                    </div>
                </div>
            </section>

            {/* --- BENTO GRID FEATURES --- */}
            <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1: OBE */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Outcome-Based Education (OBE)</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Our curriculum is architected around measurable outcomes. Every module is a building block designed to ensure students achieve specific professional competencies required by the modern industry.
                        </p>
                    </div>

                    {/* Feature 2: IABEE */}
                    <div className="bg-polman-secondary rounded-3xl p-10 text-white shadow-xl shadow-polman-secondary/20 flex flex-col justify-center">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">IABEE International Standards</h3>
                        <p className="text-white/80 leading-relaxed text-sm">
                            Aligning with global engineering education standards to provide graduates with international recognition and mobility.
                        </p>
                    </div>

                    {/* Feature 3: Industrial Alignment */}
                    <div className="md:col-span-3 bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex-1">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Industrial Alignment</h3>
                            <p className="text-gray-600 leading-relaxed max-w-xl">
                                Directly mapped to the needs of Industry 4.0. We bridge the gap between academic theory and technical application through deep industrial partnerships and hands-on laboratory experiences.
                            </p>
                        </div>
                        
                        {/* Placeholder for images as seen in design */}
                        <div className="flex gap-4">
                            <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                                <span className="text-gray-400 text-sm font-bold">Image 1</span>
                            </div>
                            <div className="w-32 h-32 bg-gray-900 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-sm font-bold">Image 2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION --- */}
            <section className="border-y border-gray-200 bg-white/50 py-16 mb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                    <div>
                        <div className="text-5xl font-bold text-polman-primary mb-2 font-headline">144</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Credits</div>
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-polman-primary mb-2 font-headline">12</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Learning Outcomes</div>
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-polman-primary mb-2 font-headline">20+</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Industry Partners</div>
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-polman-primary mb-2 font-headline">100%</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">IABEE Compliant</div>
                    </div>
                </div>
            </section>

            {/* --- TIMELINE SECTION --- */}
            <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-32">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-4xl font-headline font-bold text-gray-900 mb-4">The 4-Year Journey</h2>
                        <p className="text-gray-600 max-w-xl">A strategic timeline from foundational engineering to professional specialization.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Core</span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-polman-primary"></div> Practice</span>
                    </div>
                </div>

                <div className="relative pt-6">
                    {/* The continuous line */}
                    <div className="absolute top-[31px] left-0 w-full h-[2px] bg-gray-200 z-0 hidden md:block"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
                        {/* Year 1 */}
                        <div>
                            <div className="w-4 h-4 rounded-full bg-white border-4 border-polman-primary mb-6 mx-auto md:mx-0 shadow-sm"></div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Year 01</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4">Foundations</h4>
                            <ul className="space-y-2 text-sm text-gray-600 border-l-2 border-gray-100 pl-4">
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300">Engineering Physics</li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300">Industrial Mathematics</li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300">Manufacturing Processes</li>
                            </ul>
                        </div>

                        {/* Year 2 */}
                        <div>
                            <div className="w-4 h-4 rounded-full bg-polman-secondary border-4 border-white mb-6 mx-auto md:mx-0 shadow-sm"></div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Year 02</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4">Systems Design</h4>
                            <ul className="space-y-2 text-sm text-gray-600 border-l-2 border-gray-100 pl-4">
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-polman-primary">Operations Research</li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-polman-primary">Ergonomics & Safety</li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300">Work Measurement</li>
                            </ul>
                        </div>

                        {/* Year 3 */}
                        <div>
                            <div className="w-4 h-4 rounded-full bg-polman-primary border-4 border-white mb-6 mx-auto md:mx-0 shadow-sm"></div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Year 03</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4">Industrial Mgmt</h4>
                            <ul className="space-y-2 text-sm text-gray-600 border-l-2 border-gray-100 pl-4">
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-polman-primary">Supply Chain Mgmt</li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-polman-primary">Quality Engineering</li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-polman-primary">Production Planning</li>
                            </ul>
                        </div>

                        {/* Year 4 */}
                        <div>
                            <div className="w-4 h-4 rounded-full bg-gray-900 border-4 border-white mb-6 mx-auto md:mx-0 shadow-sm"></div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Year 04</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4">Capstone & Intern</h4>
                            <ul className="space-y-2 text-sm text-gray-600 border-l-2 border-gray-100 pl-4">
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-900">Final Project (TA)</li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-900">Industry Internship</li>
                                <li className="flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-900">Prof. Certification</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA / FOOTER SECTION --- */}
            <section className="bg-polman-primary text-white py-24 relative overflow-hidden rounded-t-[3rem] mx-4 lg:mx-8">
                {/* Huge Watermark text behind */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-headline font-black text-[15rem] opacity-5 text-white whitespace-nowrap pointer-events-none">
                    POLMAN
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Ready to define your academic future?</h2>
                    <p className="text-polman-primary-100 text-lg mb-10 max-w-2xl mx-auto opacity-80">
                        Access the complete TRIN curriculum map, track your OBE progress, and prepare for your industrial career through our integrated portal.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link 
                            href={route('login')}
                            className="w-full sm:w-auto bg-white text-polman-primary px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                        >
                            Enter Student Portal
                        </Link>
                        <button className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-bold transition-all">
                            Contact Department
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Very Bottom Footer */}
            <footer className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
                <div>
                    <span className="font-bold text-gray-600 block mb-1">TRIN POLMAN</span>
                    © 2026 POLMAN Bandung - Industrial Engineering Technology. <br className="hidden md:block"/> All Rights Reserved. IABEE Accredited Program.
                </div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-600">Terms of Service</a>
                    <a href="#" className="hover:text-gray-600">Academic Calendar</a>
                </div>
            </footer>
        </div>
    );
}