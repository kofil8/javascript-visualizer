export const EXAMPLES = [
  {
    id: "dfs",
    name: "Depth First Search (DFS)",
    description: "Visualize graph traversal using DFS",
    code: `// Define an adjacency list for the graph
const graph = {
  'A': ['B', 'C'],
  'B': ['D', 'E'],
  'C': ['F'],
  'D': [],
  'E': ['F'],
  'F': []
};

console.log("Graph Structure:");
console.table(graph);

const visited = new Set();
const result = [];

function dfs(node) {
  if (!node || visited.has(node)) return;
  
  visited.add(node);
  result.push(node);
  console.log(\`Visiting node: \${node}\`);
  
  const neighbors = graph[node];
  for (const neighbor of neighbors) {
    dfs(neighbor);
  }
}

console.log("Starting DFS from node 'A'...");
dfs('A');

console.log("Final Traversal Path:");
console.log(result);`
  },
  {
    id: "sorting",
    name: "Bubble Sort",
    description: "Watch how an array is sorted step-by-step",
    code: `const arr = [64, 34, 25, 12, 22, 11, 90];
console.log("Initial Array:", arr);

function bubbleSort(items) {
  const n = items.length;
  const steps = [...items];
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (steps[j] > steps[j + 1]) {
        // Swap
        [steps[j], steps[j + 1]] = [steps[j + 1], steps[j]];
        console.log(\`Swapped \${steps[j+1]} and \${steps[j]}\`);
        console.log([...steps]); // Log current state for visualization
      }
    }
  }
  return steps;
}

const sorted = bubbleSort(arr);
console.log("Sorted Array:", sorted);`
  },
  {
    id: "fibonacci",
    name: "Fibonacci Sequence",
    description: "Generate and visualize Fibonacci numbers",
    code: `function generateFibonacci(n) {
  const sequence = [0, 1];
  console.log("Starting sequence:", [...sequence]);
  
  for (let i = 2; i < n; i++) {
    const next = sequence[i - 1] + sequence[i - 2];
    sequence.push(next);
    console.log(\`Step \${i}: Added \${next}\`);
    console.log([...sequence]);
  }
  
  return sequence;
}

console.log("Generating 10 Fibonacci numbers...");
const result = generateFibonacci(10);
console.table(result.map((val, i) => ({ index: i, value: val })));`
  }
];
