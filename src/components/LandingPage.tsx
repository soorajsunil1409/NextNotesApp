"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import {
    ChevronRight,
    BookOpen,
    Lock,
    CloudUpload,
    Sparkles,
} from "lucide-react";
import gsap from "gsap";

const LandingPage = () => {
    const [isHovering, setIsHovering] = useState(false);
    const { theme } = useTheme();

    // Refs for GSAP animations
    const headingRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);

    // Use proper typing for the feature refs array
    const featureRefs = useRef<Array<HTMLDivElement | null>>([]);

    const handleSignIn = () => {
        signIn("google");
    };

    // Setup GSAP animations on component mount
    useEffect(() => {
        // Make sure elements are visible before animations
        gsap.set(
            [headingRef.current, descriptionRef.current, buttonRef.current],
            { opacity: 1 }
        );
        gsap.set(featureRefs.current, { opacity: 1 });

        // Initial animations
        const tl = gsap.timeline();

        tl.from(headingRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.out",
        });

        tl.from(
            descriptionRef.current,
            {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: "power2.out",
            },
            "-=0.3"
        );

        tl.from(
            buttonRef.current,
            {
                opacity: 0,
                y: 20,
                duration: 0.1,
                ease: "power2.out",
            },
            "-=0.3"
        );

        // Stagger animation for features - filter out null values
        tl.from(featureRefs.current, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
        });

        return () => {
            // Clean up animations if needed
            tl.kill();
        };
    }, []);

    // Button hover animation
    useEffect(() => {
        if (isHovering) {
            gsap.to(".chevron-icon", {
                x: 6,
                duration: 0.3,
                ease: "power2.out",
            });
        } else {
            gsap.to(".chevron-icon", {
                x: 0,
                duration: 0.3,
                ease: "power2.out",
            });
        }
    }, [isHovering]);

    const features = [
        {
            icon: <BookOpen size={24} />,
            title: "Organize Your Thoughts",
            description:
                "Keep all your ideas in one place with our intuitive note-taking system.",
        },
        {
            icon: <CloudUpload size={24} />,
            title: "Cloud Sync",
            description:
                "Access your notes from anywhere with secure cloud synchronization.",
        },
        {
            icon: <Lock size={24} />,
            title: "Private & Secure",
            description: "Your notes are encrypted and only accessible to you.",
        },
        {
            icon: <Sparkles size={24} />,
            title: "Smart Features",
            description:
                "Search, tag, and organize notes with powerful built-in tools.",
        },
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-160px)] bg-background text-primary">
            <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1
                        ref={headingRef}
                        className="text-5xl md:text-6xl font-bold mb-6"
                    >
                        <span className="text-primary">Note</span>
                        <span className="font-normal">Keeper</span>
                    </h1>
                    <p
                        ref={descriptionRef}
                        className="text-xl mb-8 text-primary/80"
                    >
                        The smart way to organize your thoughts, ideas, and
                        reminders all in one place.
                    </p>

                    <button
                        ref={buttonRef}
                        onClick={handleSignIn}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="group relative bg-primary text-background px-8 py-3 rounded-full text-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Get Started
                        <ChevronRight className="h-5 w-5 chevron-icon" />
                    </button>
                </div>

                <div
                    ref={featuresRef}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mt-12"
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                featureRefs.current[index] = el;
                            }}
                            className="bg-secondary p-6 rounded-xl shadow-md hover:shadow-lg duration-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-primary/70">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
