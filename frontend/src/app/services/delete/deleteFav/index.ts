import { api } from "../../api";

export const deleteFavoriteCoordinate = async (favId: string) => {
  try{
    console.log('Deletando coordenada: ', favId)
    await api.delete(`/favoriteCoordinate/${favId}/delete`)
  } catch(err) {
    console.error("Erro ao deletar: ", err);
    throw err;
  }
}