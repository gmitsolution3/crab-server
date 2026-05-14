import { client } from "../config/db";

const bannerCollection = client
  .db("loweCommerce")
  .collection("banners");

const categoryCollection = client
  .db("loweCommerce")
  .collection("categories");

export const productCollection = client
  .db("loweCommerce")
  .collection("products");

const orderCollection = client
  .db("loweCommerce")
  .collection("create_order");

const topSellingProductAggregationPipeline = [
  { $unwind: "$products" },
  {
    $group: {
      _id: "$products.productId",
      totalQuantitySold: { $sum: "$products.quantity" },
      totalSalesAmount: { $sum: "$products.subtotal" },
    },
  },
  { $sort: { totalQuantitySold: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product",
    },
  },
  { $unwind: "$product" },
  {
    $match: {
      "product.isDelete": false,
      "product.isDraft": false,
    },
  },
  {
    $replaceRoot: {
      newRoot: "$product",
    },
  },
];

const productGroupAggregationPipeline = [
  {
    $match: {
      isDelete: false,
      isDraft: false,
    },
  },

  {
    $group: {
      _id: "$category",

      products: {
        $push: {
          _id: "$_id",
          title: "$title",
          slug: "$slug",
          thumbnail: "$thumbnail",
          basePrice: "$basePrice",
          discount: "$discount",
          featured: "$featured",
        },
      },
    },
  },

  {
    $project: {
      _id: 0,
      category: "$_id",
      products: 1,
    },
  },
];

export const getHomeData = async () => {
  const [
    bannerData,
    categoryData,
    allProduct,
    groupedProduct,
    featuredProductData,
    topSellingProductData,
  ] = await Promise.all([
    // query for banners
    bannerCollection.findOne({}, { sort: { $natural: -1 } }),

    // query for categories
    categoryCollection.find({}).toArray(),

    // query for all product data
    productCollection
      .find({ isDraft: false, isDelete: false })
      .sort({ createdAt: -1 })
      .toArray(),

    // query for grouped product
    productCollection
      .aggregate(productGroupAggregationPipeline)
      .toArray(),

    //query for featured products
    productCollection
      .find({ isDraft: false, featured: true, isDelete: false })
      .sort({ createdAt: -1 })
      .toArray(),

    // query for top selling product
    orderCollection
      .aggregate(topSellingProductAggregationPipeline)
      .toArray(),
  ]);

  const finalData = {
    bannerData,
    categoryData,
    allProduct,
    groupedProduct,
    featuredProductData,
    topSellingProductData,
  };

  return finalData;
};
