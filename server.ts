import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // In-memory logs to show in the frontend UI
  const requestLogs: Array<{
    id: string;
    timestamp: string;
    type: "LOGIN" | "ATTENDANCE";
    direction: "SENT" | "RECEIVED";
    url: string;
    headers: Record<string, string>;
    body: any;
    status?: number;
  }> = [];

  function addLog(type: "LOGIN" | "ATTENDANCE", direction: "SENT" | "RECEIVED", url: string, headers: Record<string, string>, body: any, status?: number) {
    requestLogs.unshift({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      type,
      direction,
      url,
      headers,
      body,
      status
    });
    // Keep last 50 logs
    if (requestLogs.length > 50) {
      requestLogs.pop();
    }
  }

  // API to retrieve proxy server logs
  app.get("/api/logs", (req: Request, res: Response) => {
    res.json(requestLogs);
  });

  // API to clear logs
  app.post("/api/logs/clear", (req: Request, res: Response) => {
    requestLogs.length = 0;
    res.json({ success: true });
  });

  // Proxy Endpoint: Login
  app.post("/api/proxy/login", async (req: Request, res: Response) => {
    const targetUrl = "https://in-prod-svc-peopleapp-api.galaxy.one/sovico/api/user/login";
    const headers = {
      "Host": "in-prod-svc-peopleapp-api.galaxy.one",
      "deviceid": req.headers["deviceid"] as string || "",
      "Connection": "keep-alive",
      "version-app": "PNJ_20210105_V1",
      "Accept": "*/*",
      "Accept-Language": "vi-VN,vi;q=0.9",
      "User-Agent": "People/50 CFNetwork/1335.0.3.4 Darwin/21.6.0",
      "Content-Type": "application/json"
    };

    const originPayload = req.body;

    addLog("LOGIN", "SENT", targetUrl, headers, originPayload);

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(originPayload)
      });

      const responseText = await response.text();
      let responseBody;
      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        responseBody = { rawText: responseText };
      }

      addLog("LOGIN", "RECEIVED", targetUrl, {}, responseBody, response.status);
      res.status(response.status).json(responseBody);
    } catch (error: any) {
      const errorPayload = { error: error.message || "Failed to contact Sovico Server" };
      addLog("LOGIN", "RECEIVED", targetUrl, {}, errorPayload, 500);
      res.status(500).json(errorPayload);
    }
  });

  // Proxy Endpoint: Capture Attendance
  app.post("/api/proxy/capture", async (req: Request, res: Response) => {
    const targetUrl = "https://in-prod-svc-peopleapp-api.galaxy.one/sovico/api/ticket/attendance/wifi/capture";
    
    // Pick the custom deviceid or fallback to standard iPhone device id matched with curl
    const customDeviceId = req.headers["deviceid"] as string || "iPhone 7 Plus_Apple_iPhone9,4_15.8.5_414x736_1777944534648_5631520931";
    
    const headers = {
      "Host": "in-prod-svc-peopleapp-api.galaxy.one",
      "deviceid": customDeviceId,
      "Connection": "keep-alive",
      "Accept": "*/*",
      "version-app": "PNJ_20210105_V1",
      "version-app-redirect": "2.8",
      "Accept-Language": "vi-VN,vi;q=0.9",
      "User-Agent": "People/50 CFNetwork/1335.0.3.4 Darwin/21.6.0",
      "Content-Type": "application/json"
    };

    const originPayload = req.body;

    addLog("ATTENDANCE", "SENT", targetUrl, headers, originPayload);

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(originPayload)
      });

      const responseText = await response.text();
      let responseBody;
      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        responseBody = { rawText: responseText };
      }

      addLog("ATTENDANCE", "RECEIVED", targetUrl, {}, responseBody, response.status);
      res.status(response.status).json(responseBody);
    } catch (error: any) {
      const errorPayload = { error: error.message || "Failed to contact Sovico Server" };
      addLog("ATTENDANCE", "RECEIVED", targetUrl, {}, errorPayload, 500);
      res.status(500).json(errorPayload);
    }
  });

  // Serve static files in development & production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
