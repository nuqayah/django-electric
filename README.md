# Project Setup with Caddy

## 1. Configure Caddy

Create a file named `Caddyfile` in the root of your project and paste the following configuration:
```caddyfile
localhost:8090 {

    handle /api* {
		reverse_proxy localhost:8010
		encode zstd gzip
	}
	handle /v1/shape* {
		reverse_proxy localhost:3010
		header Access-Control-Expose-Headers "electric-offset, electric-handle, electric-schema"
		encode zstd gzip
	}
	
    handle {
        reverse_proxy localhost:5173
    }

}
```

## 2. Run the services

from the project root, run the following commands to start the development environment and the Caddy server:

```
mise run dev
sudo caddy run
```

## 3. Access the Application

Once Caddy is running, open your browser and go to:

```
https://localhost:8090
```