"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowRight, Network } from "lucide-react";

interface VisualizerProps {
  data: any;
}

const COLORS = ["#fbbf24", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b"];

export function Visualizer({ data }: VisualizerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartData = useMemo(() => {
    if (!data) return null;

    // Case 1: Array of objects (Charts)
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
      const keys = Object.keys(data[0]);
      const numericKeys = keys.filter((k) => typeof data[0][k] === "number");
      const stringKeys = keys.filter((k) => typeof data[0][k] === "string");

      if (numericKeys.length > 0) {
        return {
          type: numericKeys.length === 1 && data.length < 10 ? "pie" : "bar",
          data: data,
          xAxis: stringKeys[0] || keys[0],
          yAxis: numericKeys[0],
        };
      }
    }

    // Case 2: Simple array of numbers (Line Chart)
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === "number") {
      return {
        type: "line",
        data: data.map((v, i) => ({ index: i, value: v })),
        xAxis: "index",
        yAxis: "value",
      };
    }

    // Case 3: Array of strings (Path/Sequence - Perfect for DFS/BFS results)
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
      return {
        type: "sequence",
        data: data,
      };
    }

    // Case 4: Adjacency List (Graph Structure)
    if (typeof data === "object" && !Array.isArray(data) && data !== null) {
      const keys = Object.keys(data);
      const isAdjacencyList = keys.every(k => Array.isArray(data[k]));
      if (isAdjacencyList && keys.length > 0) {
        return {
          type: "graph",
          data: data,
        };
      }
    }

    return null;
  }, [data]);

  if (!chartData) return null;

  return (
    <div className={cn(
      "w-full min-h-[150px] rounded-xl p-6 border mt-4 transition-colors",
      isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
    )}>
      {chartData.type === "sequence" ? (
        <div className="flex flex-wrap items-center gap-3">
          {chartData.data.map((step: string, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center font-bold shadow-sm",
                isDark ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-400" : "bg-yellow-400 text-black border-yellow-500"
              )}>
                {step}
              </div>
              {i < chartData.data.length - 1 && (
                <ArrowRight size={16} className="text-zinc-400" />
              )}
            </div>
          ))}
        </div>
      ) : chartData.type === "graph" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(chartData.data).map(([node, neighbors]: [string, any]) => (
            <div key={node} className={cn(
              "p-3 rounded-lg border flex items-start gap-3",
              isDark ? "bg-white/5 border-white/5" : "bg-black/5 border-black/5"
            )}>
              <div className={cn(
                "w-8 h-8 rounded border flex items-center justify-center font-bold shrink-0",
                isDark ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "bg-blue-500 text-white border-blue-600"
              )}>
                {node}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {neighbors.map((neighbor: string, j: number) => (
                  <span key={j} className={cn(
                    "text-xs px-2 py-1 rounded border",
                    isDark ? "bg-zinc-800 text-zinc-400 border-white/5" : "bg-white text-zinc-600 border-black/5"
                  )}>
                    {neighbor}
                  </span>
                ))}
                {neighbors.length === 0 && <span className="text-xs text-zinc-400 italic">no edges</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          {chartData.type === "bar" ? (
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#ddd"} vertical={false} />
              <XAxis 
                dataKey={chartData.xAxis} 
                stroke={isDark ? "#888" : "#666"} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke={isDark ? "#888" : "#666"} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "#151515" : "#fff", 
                  border: `1px solid ${isDark ? "#333" : "#ddd"}`, 
                  borderRadius: "8px",
                  color: isDark ? "#fff" : "#000"
                }}
                itemStyle={{ color: "#fbbf24" }}
              />
              <Bar dataKey={chartData.yAxis} fill="#fbbf24" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartData.type === "line" ? (
            <LineChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#ddd"} vertical={false} />
              <XAxis 
                dataKey={chartData.xAxis} 
                stroke={isDark ? "#888" : "#666"} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke={isDark ? "#888" : "#666"} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "#151515" : "#fff", 
                  border: `1px solid ${isDark ? "#333" : "#ddd"}`, 
                  borderRadius: "8px",
                  color: isDark ? "#fff" : "#000"
                }}
                itemStyle={{ color: "#3b82f6" }}
              />
              <Line type="monotone" dataKey={chartData.yAxis} stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey={chartData.yAxis}
                nameKey={chartData.xAxis}
              >
                {chartData.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "#151515" : "#fff", 
                  border: `1px solid ${isDark ? "#333" : "#ddd"}`, 
                  borderRadius: "8px",
                  color: isDark ? "#fff" : "#000"
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
