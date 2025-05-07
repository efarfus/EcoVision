const getAccessToken = async () => {
  const clientId = "db9b9ce1-9dd0-41c2-97dc-635b9283e917";
  const clientSecret = "nbo4LLMHAm5FXrgTKLuF6kqfqDqUuOCI";

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
