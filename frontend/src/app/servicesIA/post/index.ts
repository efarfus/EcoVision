import { api } from "../api";
import * as FileSystem from "expo-file-system";

export const postImage = async (
  uri: string
): Promise<{ mask_base64: string }> => {
  try {
    let base64String: string;

    // Verifica se a URI já é uma string Base64 com prefixo
    if (uri.startsWith("data:image")) {
      console.log("URI já está em formato Base64. Apenas extraindo os dados.");
      // A string é 'data:image/png;base64,ABCD...'. Pegamos apenas a parte depois da vírgula.
      base64String = uri.split(",")[1];
    }
    // Verifica se é um arquivo local que precisa ser lido
    else if (uri.startsWith("file://")) {
      console.log("URI é um arquivo local. Lendo o conteúdo como Base64.");
      base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
    // Se não for nenhum dos formatos esperados, lança um erro
    else {
      throw new Error(
        `Formato de URI não suportado: ${uri.substring(0, 30)}...`
      );
    }

    console.log("Enviando imagem para a API...");
    const response = await api.post(
      "/predict",
      {
        image_base64: base64String,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": 'Ufsd897¨%$7s9d8fSDFs76d5sf*&¨%@',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Erro na resposta da API:", error.response.data);
    } else {
      // O erro que você recebeu cairia aqui, agora com mais detalhesaa
      console.error(
        "Erro ao processar a imagem ou configurar a requisição:",
        error.message
      );
    }
    throw error;
  }
};
