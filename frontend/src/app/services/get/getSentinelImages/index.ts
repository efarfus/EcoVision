import getAccessToken from "../../post/PostApiSentinel";

const fetchSatelliteImage = async (
  longitude: number,
  latitude: number
): Promise<string | ArrayBuffer | null> => {
  const token = await getAccessToken();

  const buffer = 0.01; // Definir o buffer de 1km
  const polygonCoordinates = [
    [longitude - buffer, latitude - buffer],
    [longitude + buffer, latitude - buffer],
    [longitude + buffer, latitude + buffer],
    [longitude - buffer, latitude + buffer],
    [longitude - buffer, latitude - buffer],
  ];

  const requestBody = {
    input: {
      bounds: {
        geometry: {
          type: "Polygon",
          coordinates: [polygonCoordinates],
        },
      },
      data: [
        {
          type: "S2L2A", // Sentinel-2 imagem com correção atmosférica
          dataFilter: {
            timeRange: {
              from: "2016-12-01T00:00:00Z",
              to: "2025-04-01T00:00:00Z",
            },
            maxCloudCoverage: 10, 
            mosaickingOrder: "leastCC",
          },
        },
      ],
    },
    output: {
      width: 512,
      height: 512,
      responses: [
        {
          identifier: "default",
          format: {
            type: "image/png",
          },
        },
      ],
    },
    evalscript: `//VERSION=3
        return [B04, B03, B02];`,
  };

  try {
    const response = await fetch(
      "https://services.sentinel-hub.com/api/v1/process",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Erro da API:", errorDetails);
      throw new Error(
        `Erro da API: ${response.status} ${
          response.statusText
        } - ${JSON.stringify(errorDetails)}`
      );
    }

    const blob = await response.blob();
    const imageBase64 = await blobToBase64(blob);
    return imageBase64;
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return null;
  }
};

export default fetchSatelliteImage;

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading blob"));
    reader.readAsDataURL(blob);
  });
}
