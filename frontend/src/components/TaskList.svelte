<script>
	import { create_electric_store } from '../store.js'; 
	import { task_api } from '../utils/api-calls.js';
	import TaskItem from './TaskItem.svelte';
	import TaskDialog from './TaskDialog.svelte';

	const tasks_store = create_electric_store({
		table: 'tmp_app_task', 
		columns: ['id', 'title', 'description', 'created_at', 'updated_at', 'is_done'],
	});

	let store_data = $state($tasks_store);

	$effect(() => {
		const unsubscribe = tasks_store.subscribe((data) => {
			store_data = data;
		});
		return unsubscribe;
	});

	let tasks = $derived(
		store_data.data.toSorted(
		(a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
	))

	let is_loading = $derived(store_data.is_loading)

	let error = $derived(store_data.error?.message || null)

	let is_dialog_open = $state(false);
	let editing_task = $state(null);

	function handle_open_create_dialog() {
		editing_task = null;
		is_dialog_open = true;
	}

	function handle_open_edit_dialog(task) {
		editing_task = task;
		is_dialog_open = true;
	}

	function handle_close_dialog() {
		is_dialog_open = false;
	}


	async function handle_update(updated_task) {
		try {
			await task_api.update(updated_task.id, updated_task);
		} catch (e) {
			console.error('Error updating task:', e);
		}
	}

	async function handle_delete(task_id) {
		try {
			await task_api.delete(task_id);
		} catch (e) {
			console.error('Error deleting task:', e);
		}
	}
</script>

<div class="mx-auto w-full max-w-2xl">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">My Tasks</h1>

		<button
			on:click={handle_open_create_dialog}
			class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		>
			+ Create Task
		</button>
	</div>

	{#if is_loading}
		<p>Loading tasks...</p>
	{:else if error}
		<div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
			<span class="font-medium">Error:</span>
			{error}
		</div>
	{:else if tasks.length === 0}
		<p class="mt-8 text-center text-muted-foreground">No tasks yet. Create one to get started!</p>
	{:else}
		<div>
			{#each tasks as task (task.id)}
				<TaskItem
					{task}
					on_edit={() => handle_open_edit_dialog(task)}
					on_delete={() => handle_delete(task.id)}
					on_update={(updated_task) => handle_update(updated_task)}
				/>
			{/each}
		</div>
	{/if}

	<TaskDialog  open={is_dialog_open} task={editing_task} on_close={handle_close_dialog} />
</div>