import { motion } from "framer-motion"
import { Github, Play, Terminal, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

export function LandingPage() {
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden font-sans text-slate-200">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            {/* Navbar */}
            <nav className="w-full z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Zap className="h-6 w-6 text-cyan-400" />
                    Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Clean</span>
                </div>
                <a href="https://github.com/yourusername/smartclean" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                        <Github className="mr-2 h-4 w-4" /> Star on GitHub
                    </Button>
                </a>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-12 pb-24 z-10 flex flex-col md:flex-row items-center gap-12">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex-1 space-y-8 text-center md:text-left"
                >
                    <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                        Organize your chaos with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">AI Intelligence</span>
                    </motion.h1>

                    <motion.p variants={item} className="text-lg text-slate-400 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                        SmartClean scans your cluttered directories, identifies duplicates, and intelligently sorts files into organized categories using local AI models. Privacy-first, ultra-fast, and open source.
                    </motion.p>

                    <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a href="https://github.com/yourusername/smartclean" target="_blank" rel="noopener noreferrer">
                            <Button className="h-14 px-8 text-lg rounded-xl bg-white text-black hover:bg-cyan-50 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all w-full sm:w-auto">
                                <Github className="mr-2 h-5 w-5" /> View on GitHub
                            </Button>
                        </a>
                        <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md w-full sm:w-auto">
                            <Play className="mr-2 h-5 w-5 fill-current" /> Watch Demo
                        </Button>
                    </motion.div>

                    <motion.div variants={item} className="pt-8 flex items-center gap-6 justify-center md:justify-start text-sm text-slate-500">
                        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> 100% Local Processing</div>
                        <div className="flex items-center gap-2"><Terminal className="h-4 w-4 text-cyan-400" /> Python Powered</div>
                    </motion.div>
                </motion.div>

                {/* Visual / Terminal Mockup */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex-1 w-full max-w-lg"
                >
                    <Card className="bg-[#0c0c0c]/80 border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden rounded-2xl border">
                        <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <CardContent className="p-6 font-mono text-xs md:text-sm space-y-2">
                            <div className="text-slate-500">$ python smart_cleaner.py --path ~/Downloads</div>
                            <div className="text-cyan-400">➜ Analyzing 4,203 files...</div>
                            <div className="text-slate-300">   • Found 102 duplicates (2.4 GB)</div>
                            <div className="text-slate-300">   • Categorizing by content type...</div>
                            <div className="text-emerald-400">✔ Moved 1,200 images to /Photos</div>
                            <div className="text-emerald-400">✔ Moved 560 documents to /Docs</div>
                            <div className="h-4" />
                            <div className="flex w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div className="w-[70%] bg-cyan-500 h-full animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            {/* Features Grid */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap className="h-8 w-8 text-amber-400" />}
                        title="Lightning Fast"
                        desc="Organize gigabytes of data in seconds with multi-threaded processing."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="h-8 w-8 text-emerald-400" />}
                        title="Privacy First"
                        desc="No data leaves your device. All AI processing happens locally on your CPU."
                    />
                    <FeatureCard
                        icon={<Terminal className="h-8 w-8 text-cyan-400" />}
                        title="Developer Friendly"
                        desc="Extensible Python codebase with a modern React frontend."
                    />
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400">{desc}</p>
        </div>
    )
}
