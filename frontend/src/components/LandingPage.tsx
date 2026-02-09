import { motion } from "framer-motion"
import { Github, Play, Terminal, Zap, ShieldCheck, Search, Sliders, CheckSquare, Download } from "lucide-react"
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
                <a href="https://github.com/dixitdharmansh7/smart-organizer" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                        <Github className="mr-2 h-4 w-4" /> Star on GitHub
                    </Button>
                </a>
            </nav>

            {/* Hero Section */}
            <main className="w-full max-w-7xl mx-auto px-6 pt-12 pb-24 z-10 flex flex-col md:flex-row items-center gap-16">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex-1 space-y-8 text-center md:text-left"
                >
                    <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                        <ShieldCheck className="h-3 w-3" /> Portfolio Showcase
                    </motion.div>

                    <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                        Your Digital Space, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Reimagined.</span>
                    </motion.h1>

                    <motion.p variants={item} className="text-lg text-slate-400 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                        SmartClean is an open-source, AI-powered file organization tool that transforms messy directories into structured workspaces. This landing page demonstrates the interface—clone the repository to use it locally.
                    </motion.p>

                    <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a href="https://github.com/dixitdharmansh7/smart-organizer" target="_blank" rel="noopener noreferrer">
                            <Button className="h-14 px-8 text-lg rounded-xl bg-white text-black hover:bg-cyan-50 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all w-full sm:w-auto">
                                <Github className="mr-2 h-5 w-5" /> Code on GitHub
                            </Button>
                        </a>
                        <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md w-full sm:w-auto">
                            <Terminal className="mr-2 h-5 w-5" /> Build Locally
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Visual / Terminal Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex-1 w-full max-w-lg relative"
                >
                    <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl rounded-full opacity-20" />
                    <Card className="bg-[#0c0c0c]/80 border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden rounded-2xl border relative z-10">
                        <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <CardContent className="p-6 font-mono text-xs md:text-sm space-y-2">
                            <div className="text-slate-500">$ python launch_app.py</div>
                            <div className="text-cyan-400">➜ Starting SmartClean Engine...</div>
                            <div className="text-slate-300">   • Connecting to local Dashboard</div>
                            <div className="text-slate-300">   • Initializing AI Classification</div>
                            <div className="text-emerald-400">➜ Ready at http://localhost:5173</div>
                            <div className="h-4" />
                            <div className="text-slate-500">Scan Results for "Downloads":</div>
                            <div className="flex justify-between text-slate-400">
                                <span>Images:</span> <span className="text-cyan-400">1,240</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Duplicates:</span> <span className="text-red-400">102</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            {/* How it Works Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-bold text-white">How It Works</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Three steps to a perfectly organized digital life.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                            <Search className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Deep Scan</h3>
                        <p className="text-sm text-slate-400">Our engine performs a recursive scan of your target folder, mapping every file and identifying empty directories.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Zap className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
                        <p className="text-sm text-slate-400">BERT-based models analyze file metadata and contents to ensure every file goes into its perfect home.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CheckSquare className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Smart Sort</h3>
                        <p className="text-sm text-slate-400">Duplicates are safely hashed and removed, while remainders are moved into categorical folders like Photos, Docs, and Code.</p>
                    </div>
                </div>
            </section>

            {/* Deployment Guide */}
            <section className="w-full max-w-4xl mx-auto px-6 py-20 bg-white/5 rounded-3xl border border-white/10 mb-32 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Download className="h-32 w-32 text-cyan-400" />
                </div>
                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl font-bold text-white">Get Started Locally</h2>
                    <p className="text-slate-400">To use the full organizer, follow these standard steps from the repository:</p>
                    <div className="bg-black/40 p-6 rounded-xl font-mono text-sm border border-white/5 space-y-3">
                        <div className="text-cyan-400">git clone https://github.com/dixitdharmansh7/smart-organizer.git</div>
                        <div className="text-slate-400">pip install -r requirements.txt</div>
                        <div className="text-slate-400">python launch_app.py</div>
                    </div>
                    <Button variant="outline" className="rounded-full border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
                        Read Installation Guide
                    </Button>
                </div>
            </section>

            <footer className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
                <div>© 2026 SmartClean by Dharmansh Dixit. MIT Licensed.</div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-cyan-400">Documentation</a>
                    <a href="#" className="hover:text-cyan-400">Privacy</a>
                    <a href="https://github.com/dixitdharmansh7/smart-organizer" className="hover:text-cyan-400">GitHub</a>
                </div>
            </footer>
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
