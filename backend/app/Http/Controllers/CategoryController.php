<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    public function __construct(private readonly AuditLogger $auditLogger) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', Category::class);

        $query = Category::query()->orderBy('name');

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        return CategoryResource::collection($query->get());
    }

    public function store(StoreCategoryRequest $request): CategoryResource
    {
        Gate::authorize('create', Category::class);

        $category = Category::create([
            ...$request->validated(),
            'active' => $request->boolean('active', true),
        ]);

        $this->auditLogger->log($request->user(), $category, 'category_created', null, $category->only(['name', 'description', 'active']));

        return new CategoryResource($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        Gate::authorize('update', $category);

        $old = $category->only(['name', 'description', 'active']);
        $category->update($request->validated());
        $category->refresh();

        $this->auditLogger->log($request->user(), $category, 'category_updated', $old, $category->only(['name', 'description', 'active']));

        return new CategoryResource($category);
    }
}
