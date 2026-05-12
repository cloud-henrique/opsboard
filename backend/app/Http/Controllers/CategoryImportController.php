<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportCategoriesRequest;
use App\Services\CategoryCsvImporter;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class CategoryImportController extends Controller
{
    public function __construct(private readonly CategoryCsvImporter $importer) {}

    public function __invoke(ImportCategoriesRequest $request): JsonResponse
    {
        Gate::authorize('import-categories');

        $summary = $this->importer->import($request->file('file')->getRealPath(), $request->user());

        return response()->json($summary);
    }
}
