import { writable } from 'svelte/store';
import { electric } from './lib/electric.js';

export function create_electric_store(config) {
	const initial_data = {
		data: [],
		is_loading: true,
		last_synced_at: undefined,
		error: undefined
	};

	const { subscribe, set, update } = writable(initial_data);

	const stream = electric.create_shape_stream(config);
	const shape = electric.create_shape(stream);

	shape.subscribe(({ rows }) => {
		update((state) => ({
			...state,
			data: rows,
			is_loading: false,
			last_synced_at: Date.now(),
			error: undefined
		}));
	});

	stream.subscribe(
		() => {},
		(error) => {
			update((state) => ({
				...state,
				error,
				is_loading: false
			}));
		}
	);

	shape.rows
		.then((rows) => {
			update((state) => ({
				...state,
				data: rows,
				is_loading: false,
				last_synced_at: Date.now()
			}));
		})
		.catch((error) => {
			update((state) => ({
				...state,
				error,
				is_loading: false
			}));
		});

	return {
		subscribe,
		set,
		update
	};
}