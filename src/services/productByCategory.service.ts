import { productCollection } from "./product.service";

export async function FindProductByCategory(categoryId: string) {
  const query = { categoryId: categoryId };

  const result = await productCollection
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return result;
}
