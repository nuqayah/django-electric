import { ShapeStream, Shape } from '@electric-sql/client';

export class ElectricService {
	constructor(base_url = 'http://localhost:3000') {
		this.base_url = base_url;
		this.shapes = new Map();
		this.streams = new Map();
	}

	create_shape_stream(options) {
		const { table, where, columns, params, replica = 'default', headers } = options;

		const stream_key = `${table}-${where || ''}-${columns?.join(',') || ''}`;

		if (this.streams.has(stream_key)) {
			return this.streams.get(stream_key);
		}

		const stream = new ShapeStream({
			url: `${this.base_url}/v1/shape`,
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