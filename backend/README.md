# OpsBoard Backend

Laravel 13 API for OpsBoard.

## Local commands

```bash
composer install
php artisan migrate:fresh --seed
php artisan test
php artisan serve --host=0.0.0.0 --port=8000
```

The API uses PostgreSQL for Docker/local runtime and SQLite in memory for tests.
