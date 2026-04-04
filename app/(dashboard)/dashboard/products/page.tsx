import { ProductForm } from "@/components/web/dashboard/products/product-form";
import { ProductList } from "@/components/web/dashboard/products/product-list";
import { connection } from "next/server";

export default async function ProductsPage() {
  await connection();
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add and manage products in your inventory.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <ProductForm />
        <div className="w-full">
          <ProductList />
        </div>
      </div>
    </div>
  );
}
