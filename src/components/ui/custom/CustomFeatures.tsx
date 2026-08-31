"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";


export function CustomFeatures() {
    const features = [
        {
            title: "Settle debts effectively",
            description:
                "Track shared expenses without the drama. We handle the math so you don't have to send awkward 'you owe me' texts.",
            skeleton: <SkeletonOne />,
            className:
                "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
        },
        {
            title: "Receipts? Just snap 'em",
            description:
                "Don't type out numbers like it's 1999. Our AI scans the bill, itemizes it, and splits it for you instantly.",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
        },
        {
            title: "See it in action",
            description:
                "Confused? Watch a quick demo. It's easier than explaining to your dad how to use Venmo.",
            skeleton: <SkeletonThree />,
            className:
                "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
        },
        {
            title: "Explore More, Worry Less",
            description:
                "Whether you’re traveling with friends or chilling at home, Batwaara keeps every shared expense perfectly balanced in real time.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none",
        },
        {
            title: "Settle Smarter, Not Harder",
            description:
                "Batwaara computes the most efficient settlement path, reducing messy payment chains into clean, minimal transactions.",
            skeleton: <SkeletonFive />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-r dark:border-neutral-800",
        },
        {
            title: "Know Where You Stand, Instantly",
            description:
                "Your Dashboard updates live for every group—showing what you owe, what others owe you, and every upcoming settlement.",
            skeleton: <SkeletonSix />,
            className: "col-span-1 lg:col-span-3 border-b dark:border-neutral-800",
        },
        {
            title: "Fewer Payments. Faster Settlements.",
            description:
                "Batwaara automatically collapses debts so your group settles with the fewest number of payments possible.",
            skeleton: <SkeletonSeven />,
            className: "col-span-1 lg:col-span-4 border-b lg:border-none dark:border-neutral-800",
        },
        {
            title: "Every Split Logged. Every Moment Clear.",
            description:
                "From dinners to trips, Batwaara keeps a transparent timeline of all splits, updates, and settlements across your groups.",
            skeleton: <SkeletonEight />,
            className: "col-span-1 lg:col-span-2 dark:border-neutral-800",
        },

    ];
    return (
        <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                    Packed with thousands of features
                </h4>

                <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                    From Image generation to video generation, Everything AI has APIs for
                    literally everything. It can even create this website copy for you.
                </p>
            </div>

            <div className="relative ">
                <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} className={feature.className}>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                            <div className=" h-full w-full">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base  max-w-4xl text-left mx-auto",
                "text-neutral-500 text-center font-normal dark:text-neutral-300",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonOne = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full  p-5  mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
                    {/* TODO */}
                    <img
                        src="/batwara-split.png"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <a
            href="https://youtu.be/z4NXXb7zIrM"
            target="__blank"
            rel="noopener noreferrer"
            className="relative flex gap-10 h-full group/image"
        >
            <div className="w-full mx-auto bg-transparent dark:bg-transparent group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
                    <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto" />
                    <img
                        src="https://img.youtube.com/vi/z4NXXb7zIrM/maxresdefault.jpg"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
                    />
                </div>
            </div>
        </a>
    );
};

export const SkeletonTwo = () => {
    const images = [
        "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    const imageVariants = {
        whileHover: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
        whileTap: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
    };
    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
            {/* TODO */}
            <div className="flex flex-row -ml-20">
                {images.map((image, idx) => (
                    <motion.div
                        variants={imageVariants}
                        key={"images-first" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
                    >
                        <img
                            src={image}
                            alt="bali images"
                            width="500"
                            height="500"
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
                        />
                    </motion.div>
                ))}
            </div>
            <div className="flex flex-row">
                {images.map((image, idx) => (
                    <motion.div
                        key={"images-second" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        variants={imageVariants}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
                    >
                        <img
                            src={image}
                            alt="bali images"
                            width="500"
                            height="500"
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
            <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
        </div>
    );
};

export const SkeletonFour = () => {
    return (
        <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
        </div>
    );
};
export const SkeletonFive = () => {
    return (
        <div className="flex items-center justify-center h-full p-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-xl w-full flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <span className="text-blue-500 font-semibold">Alex</span>
                    <span className="text-neutral-400 text-sm">pays</span>
                    <span className="text-green-500 font-semibold">Priya</span>
                </div>
                <div className="mx-auto text-2xl font-bold text-indigo-500">₹22</div>
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-sky-400 rounded-full" />
            </div>
        </div>
    );
};
export const SkeletonSix = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <img
                src="/batwara-product.png"
                className="rounded-lg shadow-2xl w-full h-full object-cover"
                alt="dashboard"
            />
        </div>
    );
};
export const SkeletonSeven = () => {
    return (
        <div className="flex items-center justify-center h-full relative">
            <div className="absolute top-8 text-sm text-neutral-400">10 payments</div>
            <div className="absolute mt-16 h-1 w-40 bg-neutral-700/30 rounded-full" />
            <div className="absolute bottom-12 text-sm text-green-400">3 optimized transfers</div>
            <div className="absolute bottom-16 h-1 w-20 bg-green-500 rounded-full" />
        </div>
    );
};

export const SkeletonEight = () => {
    return (
        <div className="h-full p-6 overflow-hidden">
            <div className="border-l border-neutral-700 pl-4 space-y-6">
                <div>
                    <p className="text-neutral-300 text-sm">Dinner at Khan Chacha</p>
                    <p className="text-neutral-500 text-xs">You paid ₹450</p>
                </div>
                <div>
                    <p className="text-neutral-300 text-sm">Cab to CP</p>
                    <p className="text-neutral-500 text-xs">Shared among 3 people</p>
                </div>
                <div>
                    <p className="text-neutral-300 text-sm">Settlement Complete</p>
                    <p className="text-green-500 text-xs">All dues cleared</p>
                </div>
            </div>
        </div>
    );
};



export const Globe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                { location: [28.6139, 77.2090], size: 0.8 },  // Delhi
                { location: [19.0760, 72.8777], size: 0.1 },  // Mumbai
                { location: [23.1291, 113.2644], size: 0.1 }, // Guangzhou
                { location: [31.2304, 121.4737], size: 0.1 }, // Shanghai
                { location: [39.9042, 116.4074], size: 0.1 }, // Beijing
                { location: [35.6762, 139.6503], size: 0.1 }, // Tokyo
                { location: [40.7128, -74.0060], size: 0.1 }, // New York
                { location: [34.0522, -118.2437], size: 0.08 }, // Los Angeles
                { location: [51.5074, -0.1278], size: 0.07 },   // London
                { location: [48.8566, 2.3522], size: 0.06 },    // Paris
                { location: [55.7558, 37.6173], size: 0.08 },   // Moscow
                { location: [52.5200, 13.4050], size: 0.05 },   // Berlin
                { location: [41.0082, 28.9784], size: 0.07 },   // Istanbul
                { location: [30.0444, 31.2357], size: 0.08 },   // Cairo
                { location: [-23.5505, -46.6333], size: 0.10 }, // São Paulo
                { location: [-22.9068, -43.1729], size: 0.07 }, // Rio de Janeiro
                { location: [19.4326, -99.1332], size: 0.09 },  // Mexico City
                { location: [-34.6037, -58.3816], size: 0.07 }, // Buenos Aires
                { location: [6.5244, 3.3792], size: 0.09 },      // Lagos
                { location: [14.5995, 120.9842], size: 0.08 },  // Manila
                { location: [13.7563, 100.5018], size: 0.07 },  // Bangkok
                { location: [1.3521, 103.8198], size: 0.05 },    // Singapore
                { location: [3.1390, 101.6869], size: 0.06 },    // Kuala Lumpur
                { location: [-6.2088, 106.8456], size: 0.10 },  // Jakarta
                { location: [24.8607, 67.0011], size: 0.09 },   // Karachi
                { location: [31.5497, 74.3436], size: 0.08 },   // Lahore
                { location: [41.3851, 2.1734], size: 0.05 },     // Barcelona
                { location: [45.4642, 9.1900], size: 0.05 },     // Milan
                { location: [40.4168, -3.7038], size: 0.05 },    // Madrid
                { location: [32.0853, 34.7818], size: 0.04 },    // Tel Aviv
                { location: [21.0278, 105.8342], size: 0.07 },   // Hanoi
                { location: [10.8231, 106.6297], size: 0.08 },   // Ho Chi Minh City
                { location: [33.8688, 151.2093], size: 0.06 },   // Sydney
                { location: [-37.8136, 144.9631], size: 0.05 },  // Melbourne
                { location: [43.6532, -79.3832], size: 0.06 },   // Toronto
                { location: [45.5017, -73.5673], size: 0.05 },   // Montreal
                { location: [25.2048, 55.2708], size: 0.06 },    // Dubai
                { location: [26.2285, 50.5860], size: 0.04 },    // Manama
                { location: [33.5731, -7.5898], size: 0.05 },    // Casablanca
                { location: [4.7110, -74.0721], size: 0.07 },    // Bogotá
                { location: [9.0820, 8.6753], size: 0.05 },      // Abuja
                { location: [50.1109, 8.6821], size: 0.04 },     // Frankfurt
                { location: [59.9343, 30.3351], size: 0.06 },    // St. Petersburg
                { location: [60.1699, 24.9384], size: 0.03 },    // Helsinki
                { location: [-33.9249, 18.4241], size: 0.04 },   // Cape Town
                { location: [-1.2921, 36.8219], size: 0.06 },    // Nairobi
                { location: [-25.7479, 28.2293], size: 0.05 },   // Pretoria
                { location: [35.6895, 51.3890], size: 0.08 },    // Tehran
                { location: [34.6937, 135.5023], size: 0.07 },   // Osaka
                { location: [22.3964, 114.1095], size: 0.08 },   // Hong Kong
            ],
            onRender: (state: Record<string, any>) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        } as any);

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            className={className}
        />
    );
};