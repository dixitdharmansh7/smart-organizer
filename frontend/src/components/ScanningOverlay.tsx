import { motion } from "framer-motion"
import { Scan, FileSearch } from "lucide-react"

interface ScanningOverlayProps {
    count: number
    currentFile: string
}

export function ScanningOverlay({ count, currentFile }: ScanningOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl"
        >
            <div className="relative">
                {/* Radar Ring 1 */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-t-2 border-r-2 border-cyan-500/50 absolute -top-8 -left-8"
                />
                {/* Radar Ring 2 */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full border-b-2 border-l-2 border-purple-500/30 absolute -top-16 -left-16"
                />

                <div className="relative z-10 bg-black/80 p-6 rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <Scan className="h-10 w-10 text-cyan-400 animate-pulse" />
                </div>
            </div>

            <div className="mt-8 text-center space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-widest uppercase">Analyzing System</h3>
                <div className="flex items-center justify-center gap-2 text-cyan-300 font-mono">
                    <FileSearch className="h-4 w-4" />
                    <span>Files Found: {count}</span>
                </div>
                <p className="text-xs text-slate-500 max-w-md truncate px-4">
                    {currentFile || "Initializing scanner..."}
                </p>
            </div>

            {/* ProgressBar Indeterminate */}
            <div className="w-64 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 w-full"
                    animate={{ x: [-256, 256] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </motion.div>
    )
}
