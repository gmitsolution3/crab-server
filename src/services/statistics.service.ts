import { client } from "../config/db";

const visitorLog = client.db("loweCommerce").collection("VisitorLog");
const userLocation = client.db("loweCommerce").collection("UserLocation");
const createOrderCollection = client
  .db("loweCommerce")
  .collection("create_order");

export const statisticsService = async () => {

  const summary = await createOrderCollection
    .aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          fraudOrders: {
            $sum: { $cond: [{ $eq: ["$FakeOrderStatus", "FRAUD"] }, 1, 0] },
          },
          legitOrders: {
            $sum: { $cond: [{ $eq: ["$FakeOrderStatus", "LEGIT"] }, 1, 0] },
          },
          unverifiedEmails: {
            $sum: { $cond: [{ $eq: ["$isEmailVerified", false] }, 1, 0] },
          },
          avgRisk: { $avg: "$riskScore" },
        },
      },
    ])
    .toArray();

  const riskOrders = await createOrderCollection
    .aggregate([
      {
        $lookup: {
          from: "UserLocation",
          localField: "customerIp",
          foreignField: "ip",
          as: "location",
        },
      },
      {
        $lookup: {
          from: "VisitorLog",
          localField: "customerIp",
          foreignField: "ip",
          as: "visitor",
        },
      },
      { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$visitor", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          customerIp: 1,
          riskScore: 1,
          FakeOrderStatus: 1,
          isEmailVerified: 1,
          city: "$location.city",
          country: "$location.country",
          isp: "$location.isp",
          screen: "$visitor.screen",
          paths: "$visitor.paths",
          createdAt: 1,
        },
      },
      { $sort: { riskScore: -1 } },
      { $limit: 50 },
    ])
    .toArray();

  // 3️⃣ IP INTELLIGENCE
  const ipStats = await createOrderCollection
    .aggregate([
      {
        $group: {
          _id: "$customerIp",
          orders: { $sum: 1 },
          avgRisk: { $avg: "$riskScore" },
          fraudCount: {
            $sum: { $cond: [{ $eq: ["$FakeOrderStatus", "FRAUD"] }, 1, 0] },
          },
        },
      },
      { $sort: { avgRisk: -1 } },
      { $limit: 20 },
    ])
    .toArray();

  // 4️⃣ BEHAVIOR ANALYTICS
  const behavior = await visitorLog
    .aggregate([
      { $unwind: "$paths" },
      {
        $group: {
          _id: "$ip",
          totalTime: { $sum: "$paths.timeSpent" },
          avgScroll: { $avg: "$paths.scrollDepth" },
          totalClicks: { $sum: "$paths.clicks" },
          totalMouse: { $sum: "$paths.mouseMoves" },
        },
      },
      { $sort: { totalTime: 1 } },
      { $limit: 20 },
    ])
    .toArray();

  // 5️⃣ LOCATION MISMATCH
  const locationMismatch = await createOrderCollection
    .aggregate([
      {
        $lookup: {
          from: "UserLocation",
          localField: "customerIp",
          foreignField: "ip",
          as: "location",
        },
      },
      { $unwind: "$location" },
      {
        $project: {
          customerIp: 1,
          riskScore: 1,
          FakeOrderStatus: 1,
          source: "$location.source",
          city: "$location.city",
          country: "$location.country",
          lat: "$location.lat",
          lng: "$location.lng",
        },
      },
    ])
    .toArray();

  return {
    summary: summary[0] || {},
    riskOrders,
    ipStats,
    behavior,
    locationMismatch,
  };
};