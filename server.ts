import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // Log requests for debugging
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

  // Proxy Login API
  app.post("/api/proxy/login", async (req, res) => {
    try {
      const payload = req.body;
      const deviceId = payload.DeviceID || "";

      console.log("Proxying login request with payload:", JSON.stringify(payload, null, 2));

      const response = await fetch("https://in-prod-svc-peopleapp-api.galaxy.one/sovico/api/user/login", {
        method: "POST",
        headers: {
          "Host": "in-prod-svc-peopleapp-api.galaxy.one",
          "deviceid": deviceId,
          "Connection": "keep-alive",
          "version-app": payload.AppVersion || "PNJ_20210105_V1",
          "Accept": "*/*",
          "Accept-Language": "vi-VN,vi;q=0.9",
          "User-Agent": "People/50 CFNetwork/1335.0.3.4 Darwin/21.6.0",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: payload.username,
          Password: payload.Password,
          OS: payload.OS || "2",
          DeviceID: payload.DeviceID || "",
          Version: payload.Version || "15.8.5",
          LangID: payload.LangID || "VN",
          DeviceName: payload.DeviceName || "iPhone 7 Plus",
          DeviceToken: payload.DeviceToken || "",
          company: payload.company || "HDBANK",
          build: payload.build || "10",
        }),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { rawText: responseText };
      }

      console.log("Login reply status:", response.status, responseData);

      res.status(response.status).json({
        status: response.status,
        ok: response.ok,
        data: responseData,
      });
    } catch (error: any) {
      console.error("Login proxy error:", error);
      res.status(500).json({
        ok: false,
        error: error.message || "Failed to contact corporate server",
      });
    }
  });

  // Proxy Capture (WiFi check-in) API
  app.post("/api/proxy/capture", async (req, res) => {
    try {
      const { Stoken, LangID, AppVersion, OS, DataHeader, company } = req.body;
      const deviceId = DataHeader?.P2 || ""; // P2 or some device token

      console.log("Proxying capture request with DataHeader:", JSON.stringify(DataHeader, null, 2));

      const response = await fetch("https://in-prod-svc-peopleapp-api.galaxy.one/sovico/api/ticket/attendance/wifi/capture", {
        method: "POST",
        headers: {
          "Host": "in-prod-svc-peopleapp-api.galaxy.one",
          "deviceid": deviceId,
          "Connection": "keep-alive",
          "Accept": "*/*",
          "version-app": AppVersion || "PNJ_20210105_V1",
          "version-app-redirect": "2.8",
          "Accept-Language": "vi-VN,vi;q=0.9",
          "User-Agent": "People/50 CFNetwork/1335.0.3.4 Darwin/21.6.0",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Stoken,
          LangID: LangID || "VN",
          AppVersion: AppVersion || "PNJ_20210105_V1",
          OS: OS || "2",
          DataHeader: {
            P0: DataHeader?.P0 || "",
            P1: DataHeader?.P1 || "o",
            P2: DataHeader?.P2 || "",
            P3: DataHeader?.P3 || "",
            P4: DataHeader?.P4 || "",
            P5: DataHeader?.P5 || "",
            P6: DataHeader?.P6 || "",
          },
          company: company || "HDBANK",
        }),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { rawText: responseText };
      }

      console.log("Capture reply status:", response.status, responseData);

      res.status(response.status).json({
        status: response.status,
        ok: response.ok,
        data: responseData,
      });
    } catch (error: any) {
      console.error("Capture proxy error:", error);
      res.status(500).json({
        ok: false,
        error: error.message || "Failed to contact corporate server",
      });
    }
  });

  // Vite integration for development mode or static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (${process.env.NODE_ENV || "development"} mode)`);
  });
}

startServer();
