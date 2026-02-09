import { Card, CardContent } from "@/components/ui/Card"
import { motion } from "framer-motion"
import { HardDrive, Files, Copy } from "lucide-react"

interface StatsCardProps {
    totalFiles: number
    spaceSavedMB: number
    duplicatesRemoved: number
    loading?: boolean
}

export function StatsCard({ totalFiles, spaceSavedMB, duplicatesRemoved, loading }: StatsCardProps) {
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
            <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-600/5 border-blue-500/30 overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 bg-blue-500/20 w-24 h-24 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500" />
                    <CardContent className="p-6 flex flex-col items-center text-center z-10 relative">
                        <div className="p-3 bg-blue-500/20 rounded-full mb-3 ring-1 ring-blue-400/50">
                            <Files className="h-6 w-6 text-blue-300" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1 tracking-tight">{loading ? "..." : totalFiles}</div>
                        <div className="text-sm font-medium text-blue-200/60 uppercase tracking-wider">Files Found</div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-600/5 border-emerald-500/30 overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 bg-emerald-500/20 w-24 h-24 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500" />
                    <CardContent className="p-6 flex flex-col items-center text-center z-10 relative">
                        <div className="p-3 bg-emerald-500/20 rounded-full mb-3 ring-1 ring-emerald-400/50">
                            <HardDrive className="h-6 w-6 text-emerald-300" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1 tracking-tight">{loading ? "..." : spaceSavedMB}<span className="text-lg text-emerald-200/50 ml-1">MB</span></div>
                        <div className="text-sm font-medium text-emerald-200/60 uppercase tracking-wider">Storage Saved</div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-amber-500/20 to-orange-600/5 border-amber-500/30 overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 bg-amber-500/20 w-24 h-24 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all duration-500" />
                    <CardContent className="p-6 flex flex-col items-center text-center z-10 relative">
                        <div className="p-3 bg-amber-500/20 rounded-full mb-3 ring-1 ring-amber-400/50">
                            <Copy className="h-6 w-6 text-amber-300" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1 tracking-tight">{loading ? "..." : duplicatesRemoved}</div>
                        <div className="text-sm font-medium text-amber-200/60 uppercase tracking-wider">Duplicates</div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
