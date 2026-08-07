// Vite `?raw` imports used by recipe docs to embed a demo's own source
// as its copyable code sample — one source of truth, can never drift.
declare module '*?raw' {
  const content: string
  export default content
}
