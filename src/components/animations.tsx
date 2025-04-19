"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Animation for the main container
export const useMainAnimation = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );

        return () => {
            gsap.killTweensOf(containerRef.current);
        };
    }, []);

    return containerRef;
};

// Animation for note cards
export const useNotesAnimation = () => {
    const notesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!notesContainerRef.current) return;

        const noteCards = notesContainerRef.current.children;

        gsap.fromTo(
            noteCards,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
            }
        );

        return () => {
            gsap.killTweensOf(noteCards);
        };
    }, []);

    return notesContainerRef;
};

// Animation for the add button
export const useAddButtonAnimation = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!buttonRef.current) return;

        // Initial animation
        gsap.fromTo(
            buttonRef.current,
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
        );

        // Hover animation
        const enterAnimation = () => {
            gsap.to(buttonRef.current, {
                scale: 1.1,
                duration: 0.3,
                ease: "power1.out",
            });
        };

        const leaveAnimation = () => {
            gsap.to(buttonRef.current, {
                scale: 1,
                duration: 0.3,
                ease: "power1.out",
            });
        };

        buttonRef.current.addEventListener("mouseenter", enterAnimation);
        buttonRef.current.addEventListener("mouseleave", leaveAnimation);

        return () => {
            if (buttonRef.current) {
                buttonRef.current.removeEventListener(
                    "mouseenter",
                    enterAnimation
                );
                buttonRef.current.removeEventListener(
                    "mouseleave",
                    leaveAnimation
                );
            }
            gsap.killTweensOf(buttonRef.current);
        };
    }, []);

    return buttonRef;
};

// Animation for individual note card
export const useNoteCardAnimation = () => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cardRef.current) return;

        // Hover animation
        const enterAnimation = () => {
            gsap.to(cardRef.current, {
                y: -5,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const leaveAnimation = () => {
            gsap.to(cardRef.current, {
                y: 0,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                duration: 0.3,
                ease: "power2.out",
            });
        };

        cardRef.current.addEventListener("mouseenter", enterAnimation);
        cardRef.current.addEventListener("mouseleave", leaveAnimation);

        return () => {
            if (cardRef.current) {
                cardRef.current.removeEventListener(
                    "mouseenter",
                    enterAnimation
                );
                cardRef.current.removeEventListener(
                    "mouseleave",
                    leaveAnimation
                );
            }
            gsap.killTweensOf(cardRef.current);
        };
    }, []);

    return cardRef;
};
