import { Request, Response } from "express";
import { encrypt } from "../utils/encryption";
import {
  getFacebookCredentialsService,
  saveFacebookCredentialsService,
} from "../services/facebook.service";

export const saveFacebookCredentials = async (req: Request, res: Response) => {
  const { fbPixelId, fbCapiToken, isEnabled } = req.body;

  if (!fbPixelId || !fbCapiToken || !isEnabled) {
    return res
      .status(400)
      .json({ success: false, message: "Missing credentials" });
  }
  const encryptedToken = encrypt(fbCapiToken);
  const credential = {
    fbPixelId,
    fbCapiToken: encryptedToken,
    isEnabled,
  };

  const result = await saveFacebookCredentialsService(credential);

  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to save credentials" });
  }

  res.status(200).json({
    success: true,
    message: "Credentials saved successfully",
    data: result,
  });
};

export const getFacebookCredentials = async (req: Request, res: Response) => {




  const result = await getFacebookCredentialsService();

  if (!result) {
    return res
      .status(404)
      .json({ success: false, message: "No credentials found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Pixel Credential founded", data: result });
};
