import { Request, Response } from "express";
import { client } from "../config/db";
import { ObjectId } from "mongodb";
import { createSteadFastParcel } from "../services/steadfast.service";

const orderCollection = client
  .db("loweCommerce")
  .collection("create_order");

export const assignCourier = async (req: Request, res: Response) => {
  try {
    const { courierService, orderId } = req.query;

    const order = await orderCollection.findOne({
      _id: new ObjectId(orderId as string),
    });

    if (courierService?.toString().toUpperCase() === "STEADFAST") {
      const courier = await createSteadFastParcel(order);

      const result = await orderCollection.updateOne(
        {
          _id: new ObjectId(orderId as string),
        },
        {
          $set: {
            courier,
          },
        },
      );

      res.status(200).json({
        success: true,
        message: "Assigned courier.",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Pathao courrier coming soon.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign courier",
    });
  }
};
