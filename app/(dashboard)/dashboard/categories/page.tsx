import { isAuthenticated } from "@/app/lib/auth-server";
import { CategoryForm } from "@/components/web/dashboard/categories/category-form";
import { CategoryList } from "@/components/web/dashboard/categories/category-list";

export default async function CategoriesPage() {
  const hasToken = await isAuthenticated();
  if (!hasToken) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage product categories for your inventory.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <CategoryForm />
        <CategoryList />
      </div>
    </div>
  );
}
