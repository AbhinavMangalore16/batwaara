
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";


// External Placeholder Images for the Skeletons
const PLACEHOLDER_IMG_SPLIT = "https://placehold.co/800x800/2962FF/FFFFFF?text=Expense+Split+UI";
const PLACEHOLDER_IMG_PROMO = "https://placehold.co/800x800/E53935/FFFFFF?text=YouTube+Video+Promo";
const PLACEHOLDER_IMG_DASHBOARD = "https://placehold.co/800x600/4CAF50/FFFFFF?text=Live+Dashboard+View";

// --- Custom Components for replacing external libs ---

// Simple SVG for YouTube Icon

// Simple Globe SVG/CSS animation placehol


// --- Skeleton Components ---

export const SkeletonOne = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full p-5 mx-auto bg-slate-900/80 rounded-xl border border-white/10 shadow-2xl group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2">
                    <img
                        src="/batwara-split.png"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-left-top rounded-lg"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-slate-950 via-transparent to-transparent w-full pointer-events-none" />
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <a
            href="https://youtu.be/La4F7RDVMRw"
            target="__blank"
            rel="noopener noreferrer"
            className="relative flex gap-10 h-full group/image overflow-hidden rounded-xl border border-white/10 shadow-2xl block"
        >
            <div className="w-full mx-auto bg-slate-950 group h-full relative">
                <div className="flex flex-1 w-full h-full flex-col space-y-2 relative min-h-[260px] sm:min-h-[300px]">
                    <div className="absolute z-20 inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] group-hover/image:scale-110 group-hover/image:bg-red-500 transition-all duration-300">
                        <IconBrandYoutubeFilled className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                    </div>

                    <img
                        src="https://img.youtube.com/vi/La4F7RDVMRw/maxresdefault.jpg"
                        alt="Batwaara Product Showcase Video"
                        width={800}
                        height={450}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/batwara-product.png";
                        }}
                        className="h-full w-full object-cover object-center rounded-lg filter contrast-110 brightness-90 group-hover/image:brightness-105 group-hover/image:scale-105 transition-all duration-300"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
                        <span className="text-xs font-mono text-white font-bold bg-slate-950/80 px-3 py-1 rounded-lg border border-white/20 flex items-center gap-2 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Watch 2-Min Demo
                        </span>
                        <span className="text-xs font-mono text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10">
                            HD 1080p
                        </span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export const SkeletonTwo = () => {
    const images = [
        "https://hosting.renderforestsites.com/images/7016963/97078/b0e92183375bbcce4586a11413681e4f.png",
        "https://www.wikihow.com/images/thumb/3/3c/Write-a-Bill-for-Payment-Step-10-Version-2.jpg/v4-460px-Write-a-Bill-for-Payment-Step-10-Version-2.jpg",
        "https://cdn.prod.website-files.com/61e7d259b7746e3f63f0b6be/62f266fdfde2c20602a59127_receipt_w_boxes.jpeg",
        "https://cdn.prod.website-files.com/61e7d259b7746e3f63f0b6be/62f266fdfde2c20602a59127_receipt_w_boxes.jpeg",
        "https://cdn.prod.website-files.com/61e7d259b7746e3f63f0b6be/62f266fdfde2c20602a59127_receipt_w_boxes.jpeg",
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
                        className="rounded-xl -mr-4 mt-4 p-1 bg-slate-900 border border-white/10 shrink-0 overflow-hidden"
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
                        className="rounded-xl -mr-4 mt-4 p-1 bg-slate-900 border border-white/10 shrink-0 overflow-hidden"
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

            <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-slate-950 to-transparent h-full pointer-events-none" />
            <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-slate-950 to-transparent h-full pointer-events-none" />
        </div>
    );
};


export const DitherImage = ({
    src,
    alt,
    className
}: {
    src: string;
    alt: string;
    className?: string;
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;

        img.onload = () => {
            const scale = 0.35;
            const w = Math.floor((img.width || 600) * scale);
            const h = Math.floor((img.height || 400) * scale);

            canvas.width = w;
            canvas.height = h;

            ctx.drawImage(img, 0, 0, w, h);
            const imgData = ctx.getImageData(0, 0, w, h);
            const data = imgData.data;

            const bayer4x4 = [
                [0, 8, 2, 10],
                [12, 4, 14, 6],
                [3, 11, 1, 9],
                [15, 7, 13, 5]
            ];

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];

                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    const threshold = (bayer4x4[y % 4][x % 4] / 16) * 255;

                    if (gray > threshold) {
                        data[idx] = 52;
                        data[idx + 1] = 211;
                        data[idx + 2] = 153;
                        data[idx + 3] = 255;
                    } else {
                        data[idx] = 15;
                        data[idx + 1] = 23;
                        data[idx + 2] = 42;
                        data[idx + 3] = 230;
                    }
                }
            }

            ctx.putImageData(imgData, 0, 0);
            setIsLoaded(true);
        };
    }, [src]);

    return (
        <div className={cn("relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl group w-full h-full bg-slate-950", className)}>
            {/* Always visible base image of friends on a trip */}
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter contrast-125 saturate-150"
            />

            {/* Canvas Dither Overlay */}
            <canvas
                ref={canvasRef}
                className={cn(
                    "absolute inset-0 w-full h-full object-cover [image-rendering:pixelated] transition-opacity duration-700 pointer-events-none mix-blend-screen opacity-90",
                    !isLoaded && "opacity-0"
                )}
            />

            {/* Dither Texture Dot Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:6px_6px] opacity-40 pointer-events-none mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

        </div>
    );
};

export const SkeletonFour = () => {
    return (
        <div className="h-80 sm:h-96 md:h-[420px] flex flex-col items-center justify-center p-2 sm:p-4 relative bg-transparent overflow-hidden w-full">
            <DitherImage
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&auto=format&fit=crop&q=80"
                alt="Friends on a trip"
                className="w-full h-full min-h-[280px] sm:min-h-[340px]"
            />
        </div>
    );
};

export const SkeletonFive = () => {
    return (
        <div className="flex items-center justify-center h-full p-6">
            <div className="bg-slate-900/90 rounded-xl p-6 shadow-xl w-full max-w-sm flex flex-col gap-4 border border-white/10">
                <p className="text-sm font-medium text-slate-400 text-center">Optimized Settlement</p>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-white/5">
                    <span className="text-cyan-400 font-semibold text-lg">Alex</span>
                    <span className="text-slate-500 text-sm italic">Owes</span>
                    <span className="text-emerald-400 font-semibold text-lg">Priya</span>
                </div>
                <div className="mx-auto text-4xl font-extrabold text-emerald-400">₹22</div>
                <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
            </div>
        </div>
    );
};

export const SkeletonSix = () => {
    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="bg-slate-900/90 rounded-xl shadow-2xl w-full h-full overflow-hidden border border-white/10">
                <img
                    src="/batwara-product.png"
                    className="w-full h-full object-cover"
                    alt="dashboard"
                />
            </div>
        </div>
    );
};

export const SkeletonSeven = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full relative p-4 lg:p-8">
            <div className="bg-slate-900/90 p-5 rounded-xl shadow-lg w-full text-center space-y-4 border border-white/10">
                <p className="text-xl font-bold text-white">Optimization</p>
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 w-3/4"></div>
                    </div>
                    <span className="text-xs text-slate-400">10 Transactions</span>
                </div>

                <div className="text-emerald-400">
                    <svg className="w-6 h-6 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </div>

                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-1/4"></div>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">3 Transactions</span>
                </div>
            </div>
        </div>
    );
};

export const SkeletonEight = () => {
    return (
        <div className="h-full pt-6 px-6 pb-12 flex items-center justify-center">
            <div className="border-l-4 border-emerald-500 pl-6 space-y-8 bg-slate-900/80 p-6 rounded-xl shadow-inner w-full border border-white/10">
                <div className="relative">
                    <p className="text-white text-sm font-semibold">Breakfast at Saravana Bhavan</p>
                    <p className="text-cyan-400 text-xs">₹780 • Paid by Divyansh • Split equally</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                </div>

                <div className="relative">
                    <p className="text-white text-sm font-semibold">Metro Recharge</p>
                    <p className="text-purple-400 text-xs">₹200 • Paid by Smriti</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                </div>

                <div className="relative">
                    <p className="text-white text-sm font-semibold">Snacks at India Gate</p>
                    <p className="text-yellow-400 text-xs">₹350 • Paid by Abhinav • Split by 3</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                </div>

                <div className="relative">
                    <p className="text-white text-sm font-semibold">Cab to Connaught Place</p>
                    <p className="text-rose-400 text-xs">₹220 • Paid by Arjun</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                </div>

                <div className="relative">
                    <p className="text-white text-sm font-semibold">Dinner at Farzi Café</p>
                    <p className="text-yellow-400 text-xs">₹2,450 • Split equally • Paid by Abhinav</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                </div>

                <div className="relative">
                    <p className="text-white text-sm font-semibold">Hotel Room @ Paharganj</p>
                    <p className="text-yellow-400 text-xs">₹3,200 • Paid by Abhinav • Split by stay duration</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                </div>

                <div className="relative">
                    <p className="text-white text-sm font-semibold">Final Settlement (Abhinav's Status)</p>
                    <p className="text-emerald-400 text-xs font-bold">Abhinav gets back ₹4,275</p>
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></span>
                </div>
            </div>
        </div>
    );
};

type DebtType = 'owe' | 'owed' | 'neutral';

interface NodeBase {
    name: string;
    x: number;
    y: number;
    color: string;
    radius: number;
}

interface FriendNode extends NodeBase {
    debtType: DebtType;
    amount: number;
}

interface UserNode extends NodeBase { }

export const SkeletonNine: React.FC = () => {
    const userPos: UserNode = { x: 100, y: 100, name: 'YOU', radius: 14, color: '#10B981' };

    const friendNodes: FriendNode[] = [
        { name: 'Alex', x: 50, y: 50, color: '#F87171', radius: 10, debtType: 'owe', amount: 1 },
        { name: 'Jane', x: 150, y: 50, color: '#34D399', radius: 12, debtType: 'owed', amount: 2 },
        { name: 'Chris', x: 150, y: 150, color: '#EF4444', radius: 15, debtType: 'owe', amount: 3 },
        { name: 'Dave', x: 50, y: 150, color: '#9CA3AF', radius: 8, debtType: 'neutral', amount: 0 },
    ];

    const getLineCoords = (
        n1: NodeBase,
        n2: NodeBase,
        offset1?: number,
        offset2?: number
    ): { startX: number; startY: number; endX: number; endY: number } => {
        const o1 = offset1 ?? n1.radius;
        const o2 = offset2 ?? n2.radius;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const startX = n1.x + (dx * o1) / dist;
        const startY = n1.y + (dy * o1) / dist;

        const endX = n2.x - (dx * o2) / dist;
        const endY = n2.y - (dy * o2) / dist;

        return { startX, startY, endX, endY };
    };

    const renderUserEdge = (friend: FriendNode): React.ReactNode => {
        if (friend.debtType === 'neutral') return null;

        const isOwe = friend.debtType === 'owe';
        const startNode: NodeBase = isOwe ? userPos : friend;
        const endNode: NodeBase = isOwe ? friend : userPos;

        const baseWidth = 1.5;
        const strokeWidth = baseWidth + (isOwe ? friend.amount * 0.75 : friend.amount * 0.5);

        const { startX, startY, endX, endY } = getLineCoords(startNode, endNode, startNode.radius, endNode.radius);

        const color = isOwe ? '#EF4444' : '#10B981';
        const marker = isOwe ? 'url(#arrowRed)' : 'url(#arrowGreen)';
        const className = isOwe ? 'stroke-red-500' : 'stroke-emerald-500';

        return (
            <line
                key={`edge-${friend.name}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={color}
                strokeWidth={strokeWidth}
                markerEnd={marker}
                strokeLinecap="round"
                className={className + ' transition-all duration-300 ease-out'}
                opacity={0.85}
            />
        );
    };

    const daveNode = friendNodes.find((n) => n.name === 'Dave');
    const janeNode = friendNodes.find((n) => n.name === 'Jane');
    const daveJaneCoords = daveNode && janeNode ? getLineCoords(daveNode, janeNode, daveNode.radius, janeNode.radius) : null;

    return (
        <div className="h-full w-full flex items-center justify-center p-4 bg-transparent">
            <div className="relative w-full h-full max-h-[350px] bg-slate-950 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                    <defs>
                        <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L5,3 L0,6 L1.5,3 z" fill="#EF4444" />
                        </marker>
                        <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L5,3 L0,6 L1.5,3 z" fill="#10B981" />
                        </marker>
                        <marker id="arrowGray" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L4,2 L0,4 L0.5,2 z" fill="#9CA3AF" />
                        </marker>
                    </defs>

                    {friendNodes.map(renderUserEdge)}

                    {daveJaneCoords && (
                        <line
                            x1={daveJaneCoords.startX}
                            y1={daveJaneCoords.startY}
                            x2={daveJaneCoords.endX}
                            y2={daveJaneCoords.endY}
                            stroke="#9CA3AF"
                            strokeWidth={1}
                            markerEnd="url(#arrowGray)"
                            className="stroke-slate-700 opacity-60"
                            strokeDasharray="4, 2"
                        />
                    )}

                    {friendNodes.map((node) => (
                        <React.Fragment key={node.name}>
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.radius + 1}
                                fill={node.color}
                                className="opacity-20"
                            />
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.radius}
                                fill="#090d16"
                                className="shadow-md transition-all duration-500 ease-in-out"
                                stroke={node.color}
                                strokeWidth={node.debtType === 'owe' || node.debtType === 'owed' ? '2.5' : '1.5'}
                            />
                            <text
                                x={node.x}
                                y={node.y + 1.5}
                                fontSize="6.5"
                                textAnchor="middle"
                                fill="#E2E8F0"
                                fontWeight="600"
                            >
                                {node.name}
                            </text>
                        </React.Fragment>
                    ))}

                    <circle cx={userPos.x} cy={userPos.y} r={userPos.radius + 4} fill="#10B981" className="opacity-15" />
                    <circle cx={userPos.x} cy={userPos.y} r={userPos.radius} fill="#059669" className="shadow-xl" />
                    <text x={userPos.x} y={userPos.y + 3} fontSize="8" textAnchor="middle" fill="#FFFFFF" fontWeight="bold" className="drop-shadow-sm">YOU</text>

                    <circle cx={userPos.x} cy={userPos.y} r={userPos.radius + 2} fill="none" stroke="#10B981" strokeWidth="1" className="animate-ping" />
                </svg>

                <div className="absolute top-4 left-4 p-2.5 bg-slate-900/90 rounded-lg shadow-lg border border-white/10">
                    <h3 className="text-xs font-bold text-white">💰 Social Debt Graph</h3>
                    <div className="mt-1 text-[10px] space-y-0.5">
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                            <span className="text-slate-300">You **Owe** (Payable)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                            <span className="text-slate-300">You are **Owed** (Receivable)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
                            <span className="text-slate-300">**YOU** (Central Node)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Globe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;
        let width = 0;

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };
        window.addEventListener('resize', onResize);
        onResize();

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.15, 0.25, 0.45],
            markerColor: [0.1, 0.8, 0.6],
            glowColor: [0.1, 0.6, 0.9],
            markers: [
                { location: [28.6139, 77.2090], size: 0.12 },
                { location: [19.0760, 72.8777], size: 0.10 },
                { location: [40.7128, -74.0060], size: 0.10 },
                { location: [51.5074, -0.1278], size: 0.08 },
                { location: [35.6762, 139.6503], size: 0.10 },
                { location: [1.3521, 103.8198], size: 0.08 },
                { location: [25.2048, 55.2708], size: 0.08 }
            ],
            onRender: (state: Record<string, any>) => {
                state.phi = phi;
                phi += 0.005;
                if (width) {
                    state.width = width * 2;
                    state.height = width * 2;
                }
            },
        } as any);

        setTimeout(() => {
            if (canvasRef.current) {
                canvasRef.current.style.opacity = '1';
            }
        }, 50);

        return () => {
            window.removeEventListener('resize', onResize);
            globe.destroy();
        };
    }, []);

    return (
        <div className={cn("w-full max-w-[500px] aspect-square relative flex items-center justify-center", className)}>
            <canvas
                ref={canvasRef}
                style={{ width: 500, height: 500, maxWidth: "100%", aspectRatio: 1 }}
                className="w-full h-full opacity-0 transition-opacity duration-700"
            />
        </div>
    );
};

// --- Core Feature Components ---

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden backdrop-blur-md bg-slate-900/60`, className)}>
            <div className="absolute inset-0 bg-slate-950/20 pointer-events-none"></div>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug font-bold">
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base max-w-4xl text-left mx-auto",
                "text-slate-400 font-normal",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonUpi = () => {
    return (
        <div className="p-6 flex flex-col items-center justify-center h-full space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="px-3 py-1.5 bg-blue-950/80 border border-blue-500/40 rounded-xl text-blue-300 text-xs font-bold font-mono flex items-center gap-1.5">
                    <img src="/integrations/payments/Paytm_logo.png" alt="Paytm" className="h-3.5 object-contain" />
                    Paytm
                </span>
                <span className="px-3 py-1.5 bg-purple-950/80 border border-purple-500/40 rounded-xl text-purple-300 text-xs font-bold font-mono flex items-center gap-1.5">
                    <img src="/integrations/payments/PhonePe_Logo.svg.webp" alt="PhonePe" className="h-3.5 object-contain" />
                    PhonePe
                </span>
                <span className="px-3 py-1.5 bg-slate-900 border border-white/20 rounded-xl text-slate-200 text-xs font-bold font-mono flex items-center gap-1.5">
                    <img src="/integrations/payments/gpay.png" alt="Google Pay" className="h-3.5 object-contain" />
                    Google Pay
                </span>
            </div>
            <div className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold rounded-xl text-xs font-mono shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                1-Click upi://pay Deep Link
            </div>
        </div>
    );
};

export function FeaturesSection() {
    const features = [
        {
            title: "Settle debts effectively",
            description: "Track shared expenses without the drama. We handle the math so you don't have to send awkward 'you owe me' texts.",
            skeleton: <SkeletonOne />,
            className: "col-span-1 lg:col-span-4 border-b lg:border-r border-white/10 bg-slate-900/60",
        },
        {
            title: "Receipts? Just snap 'em",
            description: "Don't type out numbers like it's 1999. Our AI scans the bill, itemizes it, and splits it for you instantly.",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 border-white/10 bg-slate-900/60",
        },
        {
            title: "See it in action",
            description: "Confused? Watch a quick demo. It's easier than explaining to your dad how to use Venmo.",
            skeleton: <SkeletonThree />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-r border-white/10 bg-slate-900/60",
        },
        {
            title: "Explore more, worry less",
            description: "Whether it's a road trip with the squad or just splitting WiFi, we keep the balance sheet updated so you can focus on the fun.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none border-white/10 bg-slate-900/60",
        },
    ];

    return (
        <div className="relative z-20 py-10 lg:py-20 max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-white">
                    Packed with powerful features
                </h4>
                <p className="text-base lg:text-lg max-w-3xl my-4 mx-auto text-slate-400 text-center font-normal">
                    Batwara simplifies group expenses with real-time tracking, AI-optimized settlements, and total transparency.
                </p>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-slate-950/60 backdrop-blur-md">
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