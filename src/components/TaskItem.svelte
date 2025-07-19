<script>


	let { task, on_edit, on_delete, on_update } = $props();

	async function handle_toggle_done() {
		const updated_payload = { ...task, id: task.id.toString(), is_done: !task.is_done };
		try {
			await on_update(updated_payload);
		} catch (error) {
			const checkbox = document.getElementById(`is_done_${task.id}`);
			if (checkbox) {
				checkbox.checked = task.is_done;
			}
		}
	}

	async function handle_delete() {
		if (confirm('Are you sure you want to delete this task?')) {
			try {
				await on_delete();
			} catch (error) {}
		}
	}
</script>

<div class="mb-4 rounded-lg border bg-card text-card-foreground shadow-sm">

	<div class="flex flex-col space-y-1.5 p-6">
		<div class="flex items-center justify-between">

			<h2
				class="text-xl font-semibold leading-none tracking-tight"
				class:line-through={task.is_done}
				class:text-muted-foreground={task.is_done}
			>
				{task.title}
			</h2>

			<div class="flex items-center space-x-2">

				<input
					type="checkbox"
					id="is_done_{task.id}"
					checked={task.is_done}
					onclick={handle_toggle_done}
				/>
				<label
					for="is_done_{task.id}"
					class="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Done
				</label>
			</div>
		</div>

		{#if task.description}
			<p
				class="text-sm text-muted-foreground"
				class:line-through={task.is_done}
				class:text-muted-foreground={task.is_done}
			>
				{task.description}
			</p>
		{/if}
	</div>


	<div class="flex items-center justify-between p-6 pt-0">
		<p class="text-sm text-muted-foreground">
			Updated: {new Date(task.updated_at).toLocaleString()}
		</p>
		<div class="flex space-x-2">

			<button
				onclick={on_edit}
				class="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			>
				Edit
			</button>

			<button
				onclick={handle_delete}
				class="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			>
				Delete
			</button>
		</div>
	</div>
</div>