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
            className: "text-blue-500 dark:text-blue-500",
        },
        {
            text: "customers!",
            className: "text-blue-500 dark:text-blue-500",
        },

    ]
    return (
      <TypewriterEffect words={words} />

    )
}