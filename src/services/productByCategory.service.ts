import { productCollection } from "./product.service";

export async function FindProductByCategory(categoryId: string) {
  const query = { categoryId: categoryId, isDraft: false, isDelete: false };

  const result = await productCollection
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return result;
}
