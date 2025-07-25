<script>
    import { task_api } from "../utils/api-calls";



	let { open, task, on_close, refresh } = $props();

	let form_data = $state({ title: '', description: '', is_done: false });
	let is_saving = $state(false);

	$effect(() => {
		if (task) {
			form_data.title = task.title;
			form_data.description = task.description || '';
			form_data.is_done = task.is_done;
		} else {
			form_data.title = '';
			form_data.description = '';
			form_data.is_done = false;
		}
	});

	const dialog_title = $derived(task ? 'Edit Task' : 'Create New Task');

	async function handle_submit() {
		if (!form_data.title) {
			return;
		}
		is_saving = true;
		try {
			task
				? await task_api.update(task.id, form_data)
				: await task_api.create(form_data);

			if(!task){
				await refresh()
			}

			on_close();
		} catch (error) {
		} finally {
			is_saving = false;
		}
	}
</script>

{#if open}

	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="dialog-title"
		aria-describedby="dialog-description"
		class="fixed inset-0 z-50 grid place-items-center"
	>

		<div on:click|self={on_close} class="fixed inset-0 bg-black/60" />

		<div
			class="relative z-10 grid w-full max-w-lg gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-[425px]"
		>
			<div class="flex flex-col space-y-1.5 text-center sm:text-left">
				<h2 id="dialog-title" class="text-lg font-semibold leading-none tracking-tight">
					{dialog_title}
				</h2>
				<p id="dialog-description" class="text-sm text-muted-foreground">
					{task ? 'Make changes to your task here.' : 'Add a new task to your list.'}
				</p>
			</div>

			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<label for="title" class="text-right">Title</label>
					<input
						id="title"
						bind:value={form_data.title}
						class="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						required
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<label for="description" class="text-right">Description</label>
					<input
						id="description"
						bind:value={form_data.description}
						class="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>
			</div>

			<div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
				<button
					type="button"
					on:click={on_close}
					class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					on:click={handle_submit}
					disabled={is_saving}
					class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				>
					{is_saving ? 'Saving...' : 'Save changes'}
				</button>
			</div>
		</div>
	</div>
{/if}