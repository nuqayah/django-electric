<div class="flex min-h-screen items-center justify-center bg-gray-100 px-4">
	<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-md md:p-8">
		<div class="w-full">
			<div class="grid w-full grid-cols-2 border-b border-gray-200">
				<button
					on:click={() => (active_tab = 'login')}
					class="w-full py-2.5 text-sm font-medium transition-colors -mb-px border-b-2"
					class:text-gray-900={active_tab === 'login'}
					class:border-gray-900={active_tab === 'login'}
					class:text-gray-500={active_tab !== 'login'}
					class:border-transparent={active_tab !== 'login'}
					class:hover:text-gray-700={active_tab !== 'login'}
					class:hover:border-gray-300={active_tab !== 'login'}
				>
					Login
				</button>
				<button
					class="w-full cursor-not-allowed py-2.5 text-sm font-medium text-gray-400"
					disabled
				>
					Register
				</button>
			</div>

			<div class="pt-6">
				{#if active_tab === 'login'}
					<form on:submit|preventDefault={handle_login} class="flex flex-col gap-4">
						<h2 class="text-center text-xl font-bold text-gray-700">Login</h2>

						{#if failed}
							<div class="rounded bg-red-100 p-3 text-center text-sm text-red-700">
								{error}
							</div>
						{/if}

						<div class="flex flex-col gap-2">
							<label for="email" class="text-sm font-medium text-gray-600">Email</label>
							<input
								id="email"
								type="email"
								bind:value={email}
								placeholder="mohamed@example.com"
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
								autocomplete="email"
								autofocus
							/>
						</div>

						<div class="flex flex-col gap-2">
							<label for="password" class="text-sm font-medium text-gray-600">Password</label>
							<input
								id="password"
								type="password"
								bind:value={password}
								required
								class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
								autocomplete="current-password"
							/>
						</div>

						<button
							type="submit"
							class="mt-2 flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={loading}
						>
							{#if loading}
								<svg
									class="mr-2 h-5 w-5 animate-spin text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Logging in...
							{:else}
								Log In
							{/if}
						</button>
					</form>
				{:else if active_tab === 'signup'}
					<div class="text-center text-gray-500">Registration is currently disabled.</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<script>
	let active_tab = $state('login');

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let failed = $state(false);
	let loading = $state(false);

	async function handle_login() {
		error = '';
		failed = false;
		loading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password
				})
			});

			if (response.ok) {
				location.reload();
			} else {
				failed = true;
				if (response.status === 401) {
					error = 'Invalid credentials. Please try again.';
				} else {
					const error_data = await response.json().catch(() => ({}));
					error =
						error_data.detail || `Login failed: ${response.statusText} (${response.status})`;
				}
				console.error('Login failed:', error);
			}
		} catch (err) {
			failed = true;
			error = 'A network error occurred. Please check your connection and try again.';
			console.error('Login fetch error:', err);
		}

		loading = false;
	}
</script>