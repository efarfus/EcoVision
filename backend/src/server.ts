import { app } from "./app";
import dotenv from 'dotenv';
import os from 'os';


dotenv.config();

const port = 3000;

const PORT = process.env.PORT || 3000;

const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();

  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const config of iface as os.NetworkInterfaceInfo[]) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }

  return 'localhost';
};

const localIP = getLocalIP();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://${localIP}:${PORT}`);
});

/*
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});*/