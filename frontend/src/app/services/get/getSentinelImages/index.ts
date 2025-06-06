import getAccessToken from "../../post/PostApiSentinel";

const fetchSatelliteImage = async (
  longitude: number,
  latitude: number
): Promise<string | ArrayBuffer | null> => {
  const token = await getAccessToken();

  const buffer = 0.1; // Definir o buffer de 1km
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
          type: "S2L2A",
          dataFilter: {
            timeRange: {
              from: "2024-01-01T00:00:00Z",
              to: new Date().toISOString(),
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

// --- Funções de Apoio para Melhoria de Imagem ---
function saturate(rgb, saturation) {
  const grey = (rgb[0] + rgb[1] + rgb[2]) / 3;
  return [
    grey * (1 - saturation) + rgb[0] * saturation,
    grey * (1 - saturation) + rgb[1] * saturation,
    grey * (1 - saturation) + rgb[2] * saturation
  ];
}
function applyGamma(rgb, gamma) {
    return [
        Math.pow(rgb[0], 1/gamma),
        Math.pow(rgb[1], 1/gamma),
        Math.pow(rgb[2], 1/gamma)
    ];
}

// --- Funções Principais do evalscript ---
function setup() {
  return {
    input: ["B02", "B03", "B04"],
    output: { bands: 3 }
  };
}

function evaluatePixel(sample) {
  // --- Parâmetros ajustados ---
  const gain = 2.2;
  const saturation = 1.3;
  const gamma = 1.2; // <<--- AUMENTAMOS O GAMMA
  // ---------------------------

  let rgb = [ gain * sample.B04, gain * sample.B03, gain * sample.B02 ];
  rgb = saturate(rgb, saturation);
  rgb = applyGamma(rgb, gamma);

  return rgb;
}`,
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
