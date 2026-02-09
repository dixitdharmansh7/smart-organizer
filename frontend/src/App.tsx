import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Play, RefreshCw, Sparkles, Zap } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { StatsCard } from "@/components/StatsCard"
import { CleaningView } from "@/components/CleaningView"
import { ScanningOverlay } from "@/components/ScanningOverlay"
import { LandingPage } from "@/components/LandingPage"

interface Stats {
  totalFiles: number
  spaceSavedMB: number
  duplicatesRemoved: number
}

function App() {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null)
  const [path, setPath] = useState("")
  const [stats, setStats] = useState<Stats | null>(null)
  const [isCleaning, setIsCleaning] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanCount, setScanCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [currentFile, setCurrentFile] = useState("")
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const checkBackend = async () => {
      // Direct check: if we're not on localhost, we probably don't have a backend
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setIsBackendAvailable(false)
        return
      }

      try {
        await axios.get('http://localhost:8000/api/health', { timeout: 1000 })
        setIsBackendAvailable(true)
      } catch (e) {
        setIsBackendAvailable(false)
      }
    }
    checkBackend()
  }, [])

  useEffect(() => {
    if (!isBackendAvailable) return

    ws.current = new WebSocket("ws://localhost:8000/ws/progress")
    ws.current.onopen = () => console.log("WS Connected")
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "log") {
        setLogs(prev => [...prev, data.message])
      } else if (data.type === "progress") {
        setCurrentFile(data.filename)
        setProgress(prev => Math.min(prev + (100 / (stats?.totalFiles || 100)), 99))
      } else if (data.type === "scan_progress") {
        setScanCount(data.count)
        setCurrentFile(data.current_file)
      }
    }
    return () => { ws.current?.close() }
  }, [stats, isBackendAvailable])

  const handleScan = async () => {
    if (!path) return
    setIsScanning(true)
    setScanCount(0)
    setCurrentFile("")
    setLogs([])
    try {
      const res = await axios.post("/api/scan", { path })
      if (res.data.status === "success") {
        setStats({
          totalFiles: res.data.totalFiles,
          spaceSavedMB: res.data.total_size_mb,
          duplicatesRemoved: 0
        })
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

  // Determine what to show
  if (isBackendAvailable === false) {
    return <LandingPage />
  }

  if (isBackendAvailable === null) {
    return (
      <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-12 w-12 text-cyan-500 animate-spin" />
        <p className="text-cyan-500/50 font-mono text-sm uppercase tracking-widest">Initializing SmartClean Environment...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-6 relative overflow-hidden font-sans text-slate-200">
      <AnimatePresence>
        {isScanning && <ScanningOverlay count={scanCount} currentFile={currentFile} />}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <header className="mb-12 text-center z-10 relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 mb-6 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-lg"
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-medium text-cyan-100 uppercase tracking-wider">Local File Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
        >
          Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Clean</span>
        </motion.h1>
      </header>

      <main className="w-full max-w-4xl z-10 space-y-10 pb-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-3 rounded-2xl shadow-2xl relative overflow-hidden group"
        >
          <div className="flex gap-3 relative z-10">
            <div className="relative flex-1">
              <FolderOpen className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Enter directory path (e.g. C:\Users\Downloads)"
                className="pl-12 h-14 text-lg bg-black/40 border-white/5 focus:bg-black/60 focus:border-cyan-500/50 transition-all rounded-xl"
                value={path}
                onChange={(e) => setPath(e.target.value)}
              />
            </div>
            <Button
              onClick={handleScan}
              disabled={isScanning || isCleaning || !path}
              className="h-14 px-10 bg-gradient-to-r from-cyan-600 to-blue-600 border-0 rounded-xl font-bold tracking-wide shadow-lg"
            >
              ANALYZE
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {stats && !isCleaning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <StatsCard totalFiles={stats.totalFiles} spaceSavedMB={stats.spaceSavedMB} duplicatesRemoved={stats.duplicatesRemoved} />
              <div className="flex justify-center">
                <Button size="lg" onClick={handleClean} className="h-20 px-12 text-2xl rounded-full bg-white text-black border-4 border-cyan-500/30">
                  INITIATE CLEANING
                </Button>
              </div>
            </motion.div>
          )}

          {isCleaning && (
            <CleaningView logs={logs} currentFile={currentFile} progress={progress} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
