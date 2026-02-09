import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Activity, Terminal } from "lucide-react"

interface CleaningViewProps {
    logs: string[]
    currentFile: string
    progress: number
}

export function CleaningView({ logs, currentFile, progress }: CleaningViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    return (
        <div className="w-full space-y-6">
            <Card className="border-cyan-500/20 bg-cyan-950/20 backdrop-blur-xl shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-4">
                    <CardTitle className="flex justify-between items-center text-cyan-50">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
                            <span>Processing Files</span>
                        </div>
                        <span className="text-2xl font-mono text-cyan-300 shadow-glow">{progress.toFixed(0)}%</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-cyan-200/70 font-mono">
                        <span className="truncate max-w-[80%] opacity-80">{currentFile ? `>> ${currentFile}` : ">> Waiting for stream..."}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#0c0c0c]/80 border-white/10 shadow-2xl backdrop-blur-md">
                <CardHeader className="py-3 px-4 border-b border-white/5 bg-white/5 flex flex-row items-center gap-2">
                    <Terminal className="h-4 w-4 text-slate-400" />
                    <CardTitle className="text-xs font-mono text-slate-400 uppercase tracking-widest">System Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div
                        ref={scrollRef}
                        className="h-64 overflow-y-auto font-mono text-xs p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                    >
                        {logs.map((log, i) => (
                            <div key={i} className="text-slate-300 flex gap-2">
                                <span className="text-slate-600 select-none">[{new Date().toLocaleTimeString()}]</span>
                                <span className={log.includes("Error") ? "text-red-400" : log.includes("Complete") ? "text-green-400 font-bold" : "text-slate-300"}>
                                    {log}
                                </span>
                            </div>
                        ))}
                        {logs.length === 0 && <div className="text-slate-600 italic">Ready to initialize cleaning protocol...</div>}
                        <div className="h-4" />
                        {/* spacer */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
