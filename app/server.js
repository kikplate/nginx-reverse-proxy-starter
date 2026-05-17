const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Node backend behind NGINX reverse proxy",
    time: new Date().toISOString(),
    forwarded: {
      host: req.get("host"),
      proto: req.get("x-forwarded-proto") || req.protocol,
      ip: req.get("x-real-ip") || req.ip
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Backend running on http://0.0.0.0:${port}`);
});

function shutdown() {
  server.close((error) => {
    if (error) {
      process.exitCode = 1;
    }

    process.exit();
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);