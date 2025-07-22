import { ShapeStream, Shape } from '@electric-sql/client';

export class ElectricService {
	constructor() {
		this.shapes = new Map();
		this.streams = new Map();
	}

	get_fetch_options() {
		return {
			credentials: 'include', // Important for session cookies
			headers: {
				'Content-Type': 'application/json',
			}
		};
	}

	create_shape_stream(options) {
		const { table, where, columns, params, replica = 'default', headers } = options;

		const stream_key = `${table}-${where || ''}-${columns?.join(',') || ''}`;

		if (this.streams.has(stream_key)) {
			return this.streams.get(stream_key);
		}

		const stream = new ShapeStream({
			url: `${window.location.origin}/v1/shape`,
			params: {
				table,
				where,
				columns,
				params,
				replica
			},
			headers
		});

		this.streams.set(stream_key, stream);
		return stream;
	}

	async create_user_shape_stream(options) {
		const { table, where, columns, params, replica = 'default', headers = {} } = options;

		const proxy_url = `${window.location.origin}/api/shapes/tasks`
		
		const stream_key = `user-${table}-${where || ''}-${columns?.join(',') || ''}`;

		if (this.streams.has(stream_key)) {
			return this.streams.get(stream_key);
		}

		const auth_headers = {};
		const fetch_options = this.get_fetch_options();
		const merged_headers = { ...auth_headers, ...fetch_options.headers, ...headers };

		const stream = new ShapeStream({
			url: proxy_url,
			headers: merged_headers,
			params: {
				table,
				where,
				columns,
				params,
				replica
			},
			
		});


		this.streams.set(stream_key, stream);
		return stream;
	}

	create_shape(stream) {
		const shape = new Shape(stream);
		return shape;
	}

	cleanup() {
		this.streams.forEach((stream) => {
			stream.unsubscribeAll();
		});
		this.streams.clear();
		this.shapes.clear();
	}
}

export const electric = new ElectricService();