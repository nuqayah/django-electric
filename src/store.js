import { writable, readable } from 'svelte/store';
import { electric } from './lib/electric.js';
import {router} from './App.svelte'


export const session = writable({
    loaded: false,
    is_authenticated: false,
    is_superuser: false,
})
;(async function init() {

    let is_authenticated = false
    let is_superuser = false

    const response = await fetch('/api/auth/me')
    const data = await response.json()
    if (data.is_authenticated) {
        is_authenticated = true
    }

    if (data.is_superuser) {
        is_superuser = true
    }

    session.update(v => ({
        ...v,
        is_authenticated,
        is_superuser,
        loaded: true,
    }))

    router.listen()
})()


export const now = readable(new Date(), function start(set) {
    const interval = setInterval(() => {
        set(new Date())
    }, 60000)

    return function stop() {
        clearInterval(interval)
    }
})




export function create_electric_store(config) {
    const initial_data = {
        data: [],
        is_loading: true,
        last_synced_at: undefined,
        error: undefined
    };

    const { subscribe, set, update } = writable(initial_data);
    
    let current_stream = null;
    let current_shape = null;
    let cleanup_functions = [];
    let stream_key = null;

    const cleanup = async () => {
        cleanup_functions.forEach(fn => fn());
        cleanup_functions = [];
        
        if (current_stream) {
            current_stream.unsubscribeAll();
            current_stream = null;
        }
        
        if (current_shape) {
            current_shape = null;
        }
    };

    const initialize = async (force_refresh = false) => {
        try {
            update(state => ({ ...state, is_loading: true, error: undefined }));

            await cleanup();

            current_stream = await electric.create_user_shape_stream(config);
            current_shape = electric.create_shape(current_stream);

            const shape_unsubscribe = current_shape.subscribe(({ rows }) => {
                update((state) => ({
                    ...state,
                    data: rows,
                    is_loading: false,
                    last_synced_at: Date.now(),
                    error: undefined
                }));
            });

            const stream_unsubscribe = current_stream.subscribe(
                () => {},
                (error) => {
                    console.error('Stream connection error:', error);
                    update((state) => ({ ...state, error, is_loading: false }));
                }
            );

            cleanup_functions.push(shape_unsubscribe, stream_unsubscribe);

            const initialRows = await current_shape.rows;
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
		update,
        refresh: async () =>  await initialize(true),
    };
}