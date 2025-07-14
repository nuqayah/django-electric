<script>
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { task_api } from '../utils/api-calls.js';

	let { open, task, on_save, on_close } = $props();

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
			const saved_task = task
				? await task_api.update(task.id, form_data)
				: await task_api.create(form_data);

			on_save(saved_task);
			on_close();
		} catch (error) {
		} finally {
			is_saving = false;
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={(is_open) => !is_open && on_close()}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{dialog_title}</Dialog.Title>
			<Dialog.Description>
				{task ? 'Make changes to your task here.' : 'Add a new task to your list.'}
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="title" class="text-right">Title</Label>
				<Input id="title" bind:value={form_data.title} class="col-span-3" required />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="description" class="text-right">Description</Label>
				<Input id="description" bind:value={form_data.description} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={on_close}>Cancel</Button>
			<Button type="submit" onclick={handle_submit} disabled={is_saving}>
				{is_saving ? 'Saving...' : 'Save changes'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>