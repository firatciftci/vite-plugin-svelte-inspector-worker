# Svelte inspector loads inside a web worker

A minimal reproduction for a bug in `@sveltejs/vite-plugin-svelte` 7.3.1 (with `vite` 8.3.5 and `svelte` 5.57.3).

With the inspector enabled, the plugin appends `import('virtual:svelte-inspector-path:load-inspector.js')` to Vite's `/@vite/client` module. In dev, Vite rewrites a dynamic `import()` with a non-literal specifier in a module worker to `__vite__injectQuery(...)`, which it imports from `/@vite/client`. The worker therefore loads the inspector too, and the inspector's style injection throws `ReferenceError: document is not defined` inside the worker.

## Steps

```bash
pnpm install
pnpm dev
```

Open the page and look at the browser console.

## Expected

The page shows "hello from the worker" and the console has no errors.

## Actual

The page shows "hello from the worker", and the console shows:

```
ReferenceError: document is not defined
    at updateStyle (http://localhost:5173/@vite/client:1292:3)
    at .../@sveltejs/vite-plugin-svelte/src/plugins/inspector/runtime/Inspector.svelte?svelte&type=style&lang.css:4:1
```

## Files

- `vite.config.js` turns on the inspector with `svelte({ inspector: true })`.
- `src/App.svelte` starts `src/worker.js` from a `?worker&url` import.
- `src/worker.js` has one dynamic `import()` with a variable specifier. Libraries that ship a worker bundle, such as MapLibre GL, contain the same pattern.
