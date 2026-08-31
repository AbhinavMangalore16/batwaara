"use client";
import { TypewriterEffect } from "../typewriter-effect";

export function TestimonialTitle() {
    const words = [
        {
            text: "And",
        },
        {
            text: "now",
        },        
        {
            text: "a",
        },
        {
            text: "word",
        },
                
        {
            text: "from",
        },
        {
            text: "our",
        },
                
        {
            text: "trusted",
            className: "text-cyan-400 dark:text-cyan-400",
        },
        {
            text: "customers!",
            className: "text-cyan-400 dark:text-cyan-400",
        },

    ]
    return (
      <TypewriterEffect words={words} />

    )
}