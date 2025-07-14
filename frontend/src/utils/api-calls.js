async function request(url, options) {
	const response = await fetch(`/api${url}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		}
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
		throw new Error(error.detail || `HTTP error! status: ${response.status}`);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}

export const task_api = {
	list: () => request('/tasks'),
	get: (id) => request(`/tasks/${id}`),
	create: (payload) => request('/tasks', {
		method: 'POST',
		body: JSON.stringify(payload)
	}),
	update: (id, payload) => request(`/tasks/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload)
	}),
	delete: (id) => request(`/tasks/${id}`, {
		method: 'DELETE'
	})
};