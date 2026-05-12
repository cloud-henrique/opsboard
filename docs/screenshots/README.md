# Screenshots

Real screenshots captured from the local Docker stack with seeded demo data.

Files:

- `01-login.png`
- `02-dashboard.png`
- `03-requests-list.png`
- `04-request-detail.png`
- `05-categories-import.png`
- `06-audit-logs.png`

Reproducible flow:

1. `docker compose up -d --build`
2. `docker compose exec backend php artisan migrate:fresh --seed`
3. Open `http://localhost:4200`
4. Log in with `admin@opsboard.test / password`
5. Capture the screens above and save them in this directory.
