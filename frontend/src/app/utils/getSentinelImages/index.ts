import getAccessToken from "../PostApiSentinel";

const fetchSatelliteImage = async (
  longitude: number,
  latitude: number
): Promise<string | ArrayBuffer | null> => {
  const token = await getAccessToken();

  const buffer = 0.3; // Definir o buffer de 1km
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
              from: "2016-01-01T00:00:00Z",
              to: "2025-04-01T00:00:00Z",
            },
            maxCloudCoverage: 10, 
            mosaickingOrder: "leastCC",
          },
        },
      ],
    },
    output: {
      width: 224,
      height: 224,
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
function setup() {
  return {
    input: ["B02", "B03", "B04"],
    output: { bands: 3 }
  };
}

function evaluatePixel(sample) {
  const minBrightness = 0.05; // threshold entre 0 e 1
  const brightness = (sample.B02 + sample.B03 + sample.B04) / 3;

  if (brightness < minBrightness) {
    return [0, 0, 0]; // pixel escuro, retorna preto
  }

  return [sample.B04, sample.B03, sample.B02]; // RGB padrão
}`
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
