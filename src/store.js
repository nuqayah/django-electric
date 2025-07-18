import { writable } from 'svelte/store';
import { electric } from './lib/electric.js';

export  function create_electric_store(config) {
	const initial_data = {
		data: [],
		is_loading: true,
		last_synced_at: undefined,
		error: undefined
	};

	const { subscribe, set, update } = writable(initial_data);

	const initialize = async () => {
		try {
			const stream = await electric.create_user_shape_stream(config);

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
					console.error('Stream connection error:', error);
					update((state) => ({ ...state, error, is_loading: false }));
				}
			);

			const initialRows = await shape.rows;
			update((state) => ({
				...state,
				data: initialRows,
				is_loading: false, 
				last_synced_at: Date.now()
			}));

		} catch (error) {
			console.error('Failed to initialize electric store:', error);
			update((state) => ({ ...state, error, is_loading: false }));
		}
	};

	initialize();

	return {
		subscribe,
		set,
		update
	};
}