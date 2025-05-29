const getAccessToken = async () => {
  const clientId = "78e04c94-38e0-4577-9833-d1e321c2ecc2";
  const clientSecret = "9awpa8k3l4xkzy01y6Q9c9Dk4cDw7Wrq";

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
