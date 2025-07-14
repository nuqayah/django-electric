<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { task_api } from '../utils/api-calls.js';

	let { task, on_edit, on_delete, on_update } = $props();

	async function handle_toggle_done() {
		const updated_payload = { ...task, is_done: !task.is_done };
		try {
			const updated_task = await task_api.update(task.id, updated_payload);
			on_update(updated_task);
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
				await task_api.delete(task.id);
				on_delete();
			} catch (error) {}
		}
	}
</script>

<Card.Root class="mb-4">
	<Card.Header>
		<div class="flex items-center justify-between">
			<Card.Title class={task.is_done ? 'line-through text-muted-foreground' : ''}>
				{task.title}
			</Card.Title>
			<div class="flex items-center space-x-2">
				<Checkbox id="is_done_{task.id}" checked={task.is_done} onclick={handle_toggle_done} />
				<label for="is_done_{task.id}" class="text-sm font-medium leading-none"> Done </label>
			</div>
		</div>
		{#if task.description}
			<Card.Description class={task.is_done ? 'line-through text-muted-foreground' : ''}>
				{task.description}
			</Card.Description>
		{/if}
	</Card.Header>
	<Card.Footer class="flex justify-between">
		<p class="text-sm text-muted-foreground">
			Updated: {new Date(task.updated_at).toLocaleString()}
		</p>
		<div class="flex space-x-2">
			<Button variant="outline" size="sm" onclick={on_edit}>Edit</Button>
			<Button variant="destructive" size="sm" onclick={handle_delete}>Delete</Button>
		</div>
	</Card.Footer>
</Card.Root>