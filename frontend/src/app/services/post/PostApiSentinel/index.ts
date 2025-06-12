const getAccessToken = async () => {
  const clientId = "3cf365d6-66b7-4d14-a667-8759ad7a69d4";
  const clientSecret = "qgE3zqXiBZApTAPZT2gQG2VD73FkUzf5";

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret
  });

  try {
      const response = await fetch("https://services.sentinel-hub.com/oauth/token", {
          method: "POST",
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          body: body.toString()
      });
      
      if (!response.ok) {
          throw new Error(`Erro ao obter token: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
  } catch (error) {
      console.error("Erro ao obter token de acesso:", error);
      throw error; // Propaga o erro para quem chamou
  }
};



export default getAccessToken;
