import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Play, RefreshCw, Sparkles, Zap } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { StatsCard } from "@/components/StatsCard"
import { CleaningView } from "@/components/CleaningView"

interface Stats {
  totalFiles: number
  spaceSavedMB: number
  duplicatesRemoved: number
}

function App() {
  const [path, setPath] = useState("")
  const [stats, setStats] = useState<Stats | null>(null)
  const [isCleaning, setIsCleaning] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [currentFile, setCurrentFile] = useState("")
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws/progress")
    ws.current.onopen = () => console.log("WS Connected")
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "log") {
        setLogs(prev => [...prev, data.message])
      } else if (data.type === "progress") {
        setCurrentFile(data.filename)
        setProgress(prev => Math.min(prev + (100 / (stats?.totalFiles || 100)), 99))
      }
    }
    return () => { ws.current?.close() }
  }, [stats])

  const handleScan = async () => {
    if (!path) return
    setIsScanning(true)
    setLogs([])
    try {
      const res = await axios.post("/api/scan", { path })
      if (res.data.status === "success") {
        setStats({
          totalFiles: res.data.totalFiles,
          spaceSavedMB: res.data.total_size_mb,
          duplicatesRemoved: 0
        })
      } else {
        console.error(res.data.message)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsScanning(false)
    }
  }

  const handleClean = async () => {
    if (!path || !stats) return
    setIsCleaning(true)
    setProgress(0)
    setLogs(["Starting cleaning process..."])
    try {
      const res = await axios.post("/api/clean", {
        path, simulate: false, ai_mode: false, remove_empty: true
      })
      if (res.data.status === "success") {
        setProgress(100)
        setStats({
          totalFiles: 0,
          spaceSavedMB: res.data.stats.space_saved_mb,
          duplicatesRemoved: res.data.stats.duplicates_removed
        })
        setLogs(prev => [...prev, "Cleaning Complete!"])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      <header className="mb-16 text-center z-10 relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 mb-4 bg-white/5 backdrop-blur-lg border border-white/10 px-4 py-1.5 rounded-full"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-100">AI-Powered Organization</span>
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-xl"
        >
          Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Clean</span>
        </motion.h1>

        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-slate-400 max-w-lg mx-auto"
        >
          Instantly organize your chaotic folders with intelligent file sorting and duplicate removal.
        </motion.p>
      </header>

      <main className="w-full max-w-3xl z-10 space-y-8 pb-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl"
        >
          <div className="flex gap-2 p-1">
            <div className="relative flex-1 group">
              <FolderOpen className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <Input
                placeholder="Paste folder path here..."
                className="pl-12 h-12 text-lg bg-black/20 border-transparent focus:bg-black/40 focus:border-cyan-500/50 transition-all rounded-xl"
                value={path}
                onChange={(e) => setPath(e.target.value)}
              />
            </div>
            <Button
              onClick={handleScan}
              disabled={isScanning || isCleaning || !path}
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 rounded-xl font-semibold shadow-lg shadow-cyan-500/20"
            >
              {isScanning ? <RefreshCw className="h-5 w-5 animate-spin" /> : <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> Scan</div>}
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {stats && !isCleaning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <StatsCard
                totalFiles={stats.totalFiles}
                spaceSavedMB={stats.spaceSavedMB}
                duplicatesRemoved={stats.duplicatesRemoved}
                loading={isScanning}
              />

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <Button
                  size="lg"
                  onClick={handleClean}
                  className="h-16 px-10 text-xl rounded-full bg-white text-blue-900 hover:bg-slate-100 border-4 border-blue-500/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <Play className="mr-3 h-6 w-6 fill-current group-hover:scale-110 transition-transform" />
                  Clean Files Now
                </Button>
              </motion.div>
            </motion.div>
          )}

          {isCleaning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <CleaningView
                logs={logs}
                currentFile={currentFile}
                progress={progress}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
