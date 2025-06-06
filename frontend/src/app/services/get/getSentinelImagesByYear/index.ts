import getAccessToken from "../../post/PostApiSentinel";

const getSentinelImagesByYear = async (
  longitude: number,
  latitude: number,
  year: number
): Promise<string | ArrayBuffer | null> => {
  const token = await getAccessToken();

  const fromDate = `${year}-01-01T00:00:00Z`;
  const toDate = `${year}-12-31T23:59:59Z`;

  const buffer = 0.1;
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
              from: fromDate,
              to: toDate,
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
  const minBrightness = 0.05;
  const brightness = (sample.B02 + sample.B03 + sample.B04) / 3;

  if (brightness < minBrightness) {
    return [0, 0, 0];
  }

  return [sample.B04, sample.B03, sample.B02];
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

export default getSentinelImagesByYear;

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        let base64String = reader.result.toString();

        if (base64String.startsWith("data:application/octet-stream")) {
          base64String = base64String.replace(
            "data:application/octet-stream",
            "data:image/png"
          );
        }

        resolve(base64String);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = (error) => reject(error); 
    reader.readAsDataURL(blob);
  });
}
