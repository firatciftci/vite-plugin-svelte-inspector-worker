export const loadPlugin = (url) => import(/* @vite-ignore */ url);

self.postMessage('hello from the worker');
