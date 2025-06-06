import { app } from "./app";
import dotenv from 'dotenv';
import os from 'os';


dotenv.config();

const port = 3000;

const PORT = process.env.PORT || 3000;

const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (name.toLowerCase().includes('wi-fi')) {
      const iface = interfaces[name];
      if (!iface) continue;

      for (const config of iface) {
        if (config.family === 'IPv4' && !config.internal) {
          return config.address;
        }
      }
    }
  }

  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address; // Retorna o primeiro que encontrar
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