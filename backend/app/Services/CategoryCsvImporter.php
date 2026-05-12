<?php

namespace App\Services;

use App\Models\Category;
use App\Models\User;
use SplFileObject;

class CategoryCsvImporter
{
    public function __construct(private readonly AuditLogger $auditLogger) {}

    /**
     * @return array{created:int, updated:int, failed:int, errors:array<int, array{row:int, message:string}>}
     */
    public function import(string $path, User $user): array
    {
        $file = new SplFileObject($path);
        $file->setFlags(SplFileObject::READ_CSV | SplFileObject::SKIP_EMPTY);

        $created = 0;
        $updated = 0;
        $failed = 0;
        $errors = [];
        $header = null;

        foreach ($file as $index => $row) {
            if ($row === [null] || $row === false) {
                continue;
            }

            $rowNumber = $index + 1;
            $values = array_map(fn ($value) => is_string($value) ? trim($value) : $value, $row);

            if ($header === null) {
                $header = array_map('strtolower', $values);
                continue;
            }

            $data = array_combine($header, array_pad($values, count($header), null));

            if (! is_array($data) || empty($data['name'])) {
                $failed++;
                $errors[] = ['row' => $rowNumber, 'message' => 'Name is required.'];
                continue;
            }

            $active = $this->parseActive($data['active'] ?? null);

            if ($active === null) {
                $failed++;
                $errors[] = ['row' => $rowNumber, 'message' => 'Active must be 1, 0, true, false, or empty.'];
                continue;
            }

            $category = Category::where('name', $data['name'])->first();
            $payload = [
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'active' => $active,
            ];

            if ($category) {
                $old = $category->only(['name', 'description', 'active']);
                $category->update($payload);
                $updated++;
                $this->auditLogger->log($user, $category, 'category_updated', $old, $category->fresh()->only(['name', 'description', 'active']));
            } else {
                $category = Category::create($payload);
                $created++;
                $this->auditLogger->log($user, $category, 'category_created', null, $category->only(['name', 'description', 'active']));
            }
        }

        return compact('created', 'updated', 'failed', 'errors');
    }

    private function parseActive(mixed $value): ?bool
    {
        if ($value === null || $value === '') {
            return true;
        }

        return match (strtolower((string) $value)) {
            '1', 'true' => true,
            '0', 'false' => false,
            default => null,
        };
    }
}
