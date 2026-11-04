<script>
	import workerUrl from './worker.js?worker&url';

	let message = $state('waiting for worker');

	const worker = new Worker(workerUrl, { type: 'module' });
	worker.onmessage = (event) => (message = event.data);
	worker.onerror = (event) => (message = `worker error: ${event.message}`);
</script>

<p>{message}</p>
