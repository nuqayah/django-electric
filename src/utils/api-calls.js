
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function request(url, options = {}) { 
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, 
    };



    const response = await fetch(`/api${url}`, {
        ...options,
        headers: headers 
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

async function initialize_api() {
    try {
        await fetch('/api/get-csrf-token/');
    } catch (e) {
        console.error("Failed to fetch CSRF token", e);
    }
}

await initialize_api()
const csrftoken = getCookie('csrftoken');

export const task_api = {

	list: () => request('/tasks'),
	get: (id) => request(`/tasks/${id}`),
	create: (payload) => request('/tasks', {
		method: 'POST',
		body: JSON.stringify(payload),
        headers: {'X-CSRFToken': csrftoken}
	}),
	update: (id, payload) => request(`/tasks/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload),
        headers: {'X-CSRFToken': csrftoken}
	}),
	delete: (id) => request(`/tasks/${id}`, {
		method: 'DELETE',
        headers: {'X-CSRFToken': csrftoken},
	})
};