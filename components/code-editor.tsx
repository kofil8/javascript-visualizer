"use client";

import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-0">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || "")}
        loading={<div className="flex items-center justify-center h-full text-zinc-500 font-mono text-xs">Loading Editor...</div>}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'Geist Mono', monospace",
          cursorStyle: "line",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          contextmenu: false,
          fixedOverflowWidgets: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          // Mobile optimizations
          links: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
        }}
      />
    </div>
  );
}
