"use client";

import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/code-editor";
import { ExecutionControls } from "@/components/execution-controls";
import { 
  Play, 
  Trash2, 
  Share2, 
  Save, 
  LayoutPanelLeft, 
  Terminal, 
  AlertCircle, 
  History,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Code2,
  Menu,
  X,
  Maximize2,
  Minimize2
} from "lucide-react";
import { executeCode, type ExecutionLog } from "@/lib/engine/runner";
import { cn } from "@/lib/utils";
import { Visualizer } from "@/components/visualizer";
import { createClient } from "@/lib/supabase/client";
import { EXAMPLES } from "@/components/examples/example-snippets";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const supabase = createClient();
  const [code, setCode] = useState<string>(EXAMPLES[0].code);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setLogs([]);
    setCurrentStep(-1);
    setActiveTab('output');

    try {
      const result = await executeCode(code);
      setLogs(result.logs);
      setError(result.error);
      if (result.logs.length > 0) {
        setCurrentStep(result.logs.length - 1);
      }
    } catch (err) {
      setError("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setLogs([]);
    setError(null);
    setCurrentStep(-1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('snippets')
        .insert([{ name: 'My Snippet', code: code, is_public: true }]);
      if (error) throw error;
      alert("Snippet saved successfully!");
    } catch (err: any) {
      alert("Error saving snippet: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snippet.js';
    a.click();
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
    setShowExamples(false);
    setLogs([]);
    setError(null);
    setCurrentStep(-1);
    setActiveTab('editor');
  };

  const visibleLogs = currentStep === -1 ? logs : logs.slice(0, currentStep + 1);

  return (
    <main className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-yellow-400/30">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#0a0a0a]/80 backdrop-blur-md z-40 sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg md:hidden text-zinc-400"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <span className="text-black font-bold text-xl">JS</span>
            </div>
            <h1 className="font-bold text-lg tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Visualizer <span className="text-[10px] font-medium text-yellow-500/80 uppercase tracking-widest ml-1 px-1.5 py-0.5 border border-yellow-500/20 rounded bg-yellow-500/5">Pro</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setShowExamples(!showExamples)}
            className={cn(
              "flex items-center gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all",
              showExamples ? "bg-yellow-400 text-black" : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden xs:inline">Examples</span>
          </button>
          <div className="h-6 w-[1px] bg-white/10 mx-0.5 sm:mx-1 hidden xs:block" />
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
              <Share2 size={18} />
            </button>
            <button onClick={handleSave} disabled={isSaving} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-50">
              <Save size={18} className={cn(isSaving && "animate-pulse")} />
            </button>
          </div>
          <ExecutionControls onRun={handleRun} onClear={handleClear} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Examples Overlay */}
        <AnimatePresence>
          {showExamples && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl p-4 md:p-8 overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
                      <BookOpen className="text-yellow-400" />
                      Algorithm Library
                    </h2>
                    <p className="text-zinc-500">Select a template to start visualizing complex logic instantly.</p>
                  </div>
                  <button onClick={() => setShowExamples(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {EXAMPLES.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => loadExample(example.code)}
                      className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-yellow-400/50 hover:bg-white/[0.06] transition-all text-left group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={16} className="text-yellow-400" fill="currentColor" />
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400">
                          <Code2 size={20} />
                        </div>
                        <h3 className="font-bold text-lg group-hover:text-yellow-400 transition-colors">{example.name}</h3>
                      </div>
                      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{example.description}</p>
                      <div className="text-[10px] font-mono text-zinc-500 bg-black/40 p-3 rounded-xl border border-white/5 line-clamp-3 group-hover:text-zinc-300 transition-colors">
                        {example.code}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex w-14 border-r border-white/5 flex-col items-center py-6 gap-6 bg-[#0a0a0a]">
          <button className="p-2.5 bg-yellow-400/10 rounded-xl text-yellow-400 shadow-lg shadow-yellow-400/5">
            <LayoutPanelLeft size={22} />
          </button>
          <button className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
            <Terminal size={22} />
          </button>
          <button className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
            <History size={22} />
          </button>
          <div className="mt-auto flex flex-col gap-4">
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
              {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex bg-[#151515]/90 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-2xl ring-1 ring-white/5">
          <button 
            onClick={() => setActiveTab('editor')}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest",
              activeTab === 'editor' ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" : "text-zinc-500"
            )}
          >
            Editor
          </button>
          <button 
            onClick={() => setActiveTab('output')}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest",
              activeTab === 'output' ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" : "text-zinc-500"
            )}
          >
            Output
          </button>
        </div>

        {/* Editor and Preview Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Editor Section */}
          <div className={cn(
            "flex-1 flex flex-col border-r border-white/5 min-w-0 transition-all duration-300",
            activeTab === 'output' ? "hidden md:flex" : "flex"
          )}>
            <div className="h-10 bg-[#0a0a0a] border-b border-white/5 flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Source Editor</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600">main.js</span>
            </div>
            <div className="flex-1 relative bg-[#050505] overflow-hidden">
              <CodeEditor code={code} onChange={setCode} />
            </div>
          </div>

          {/* Visualization Section */}
          <div className={cn(
            "flex-1 flex flex-col bg-[#050505] transition-all duration-300 min-w-0",
            activeTab === 'editor' ? "hidden md:flex" : "flex"
          )}>
            <div className="h-10 bg-[#0a0a0a] border-b border-white/5 flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Visual Output</span>
              </div>
              
              {logs.length > 0 && (
                <div className="flex items-center gap-1 bg-white/5 rounded-lg px-1.5 py-0.5 border border-white/5">
                  <button 
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep <= 0}
                    className="p-1 hover:text-white text-zinc-500 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[9px] font-mono text-zinc-400 min-w-[50px] text-center">
                    {currentStep + 1} / {logs.length}
                  </span>
                  <button 
                    onClick={() => setCurrentStep(Math.min(logs.length - 1, currentStep + 1))}
                    disabled={currentStep >= logs.length - 1}
                    className="p-1 hover:text-white text-zinc-500 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <div className="w-[1px] h-3 bg-white/10 mx-1" />
                  <button 
                    onClick={() => setCurrentStep(logs.length - 1)}
                    className={cn("px-1.5 py-0.5 text-[9px] font-bold rounded transition-colors", currentStep === logs.length - 1 ? "bg-yellow-400/10 text-yellow-400" : "text-zinc-500 hover:text-zinc-300")}
                  >
                    LIVE
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-4 md:p-8 overflow-y-auto font-mono custom-scrollbar pb-24 md:pb-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-4 text-red-400 shadow-xl shadow-red-500/5"
                  >
                    <div className="p-2 rounded-xl bg-red-500/10 h-fit">
                      <AlertCircle size={20} className="shrink-0" />
                    </div>
                    <div className="text-sm">
                      <p className="font-bold mb-1 text-base">Runtime Exception</p>
                      <p className="opacity-80 leading-relaxed">{error}</p>
                    </div>
                  </motion.div>
                )}

                {logs.length === 0 && !error && (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-zinc-600 gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
                      <div className="relative w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                        <Play size={40} className={cn("opacity-20 transition-all duration-500", isRunning && "text-yellow-400 opacity-100 scale-110")} fill={isRunning ? "currentColor" : "none"} />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium text-zinc-400">{isRunning ? "Processing Logic..." : "Ready for Execution"}</p>
                      <p className="text-sm text-zinc-600 max-w-[240px]">Write some code or load an example to see the magic happen.</p>
                    </div>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {visibleLogs.map((log, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "group transition-all duration-500 p-4 rounded-2xl border",
                        index === currentStep 
                          ? "bg-white/[0.03] border-white/10 shadow-2xl shadow-black scale-100" 
                          : "bg-transparent border-transparent opacity-40 scale-[0.98] grayscale"
                      )}
                    >
                      <div className="flex gap-4 text-sm">
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <span className={cn(
                            "text-[9px] uppercase px-2 py-1 rounded-lg font-bold tracking-wider",
                            log.type === 'error' ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                            log.type === 'warn' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          )}>
                            {log.type}
                          </span>
                          <span className="text-[8px] text-zinc-600 font-medium flex items-center gap-1">
                            <Clock size={8} />
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {log.type === 'table' ? (
                            <div className="space-y-4">
                              <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-white/[0.02]">
                                      {Object.keys(Array.isArray(log.content[0]) ? log.content[0][0] || {} : log.content[0][0] || log.content[0] || {}).map(key => (
                                        <th key={key} className="p-3 border-b border-white/5 text-zinc-500 font-bold uppercase tracking-tighter">{key}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(Array.isArray(log.content[0]) ? log.content[0] : [log.content[0]]).map((row: any, i: number) => (
                                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        {Object.values(row).map((val: any, j: number) => (
                                          <td key={j} className="p-3 border-b border-white/5 text-zinc-300">
                                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <Visualizer data={log.content[0]} />
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-3">
                                {log.content.map((item, i) => (
                                  <pre key={i} className="text-zinc-300 whitespace-pre-wrap break-all leading-relaxed bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                    {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
                                  </pre>
                                ))}
                              </div>
                              {log.content.some(item => Array.isArray(item) || (typeof item === 'object' && item !== null)) && (
                                <Visualizer data={log.content.find(item => Array.isArray(item) || (typeof item === 'object' && item !== null))} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-white/5 bg-[#0a0a0a] flex items-center px-4 justify-between text-[10px] text-zinc-500 z-40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            JavaScript ES2024
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            UTF-8
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono">{logs.length} Steps Captured</span>
          <span className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px]", isRunning ? "bg-yellow-500 shadow-yellow-500/50 animate-pulse" : "bg-green-500 shadow-green-500/50")} />
            {isRunning ? "Executing..." : "System Ready"}
          </span>
        </div>
      </footer>
    </main>
  );
}
