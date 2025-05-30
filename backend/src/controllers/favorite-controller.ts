import jwt from 'jsonwebtoken'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { FavoriteRepository } from '../repositories/favorites-repository';

const { validationResult } = require('express-validator');



const favoriteRepository = new FavoriteRepository();
const prisma = new PrismaClient

export const getCoordinate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {id} = req.params

    const coordinates = await favoriteRepository.getFavoriteById(id)

    res.status(200).json({coordinates});
    return
  } catch (error) {
    console.log("Erro ao localizar coordenada: ", error)
    res.status(500).send('Fetching coordinates failed, please try again later.'); 
    return
  }
};

export const getAllFavoritedCoordinates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId

    if(!userId){
    console.error("Usuário não autorizado!")
    return
  }

    const coordinates = await favoriteRepository.getFavoriteByUserId(userId)

    res.status(200).json({coordinates});
    return
  } catch (error) {
    console.log("Erro ao localizar coordenadas: ", error)
    res.status(500).send('Fetching coordinates failed, please try again later.'); 
    return
  }
};

export const addFavoriteCoordinate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { latitude, longitude, uri } = req.body;
  const userId = req.userId

  if(!userId){
    console.error("Usuário não autorizado!")
    return
  }

  try {
    await favoriteRepository.createFavorite(
      userId,
      latitude,
      longitude,
      uri,
    );

    res.status(201).json({message: 'Coordinate sucessfully added!'});
    return
  } catch (error) {
    console.error("An error ha occured during favorite process: ", error)
    res.status(500).send('An unexpected error has occured, please try again later.');
    return
  }
};

export const deleteFvorite = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const { id } = req.params

    const deletedCoordinate = await favoriteRepository.deleteFavorite(id)

    if(!deletedCoordinate){
      res.status(404).json({message: "Coordenada não encontrada"})
      return
    }

    res.status(200).json({message: "Coordenada deletada com sucesso: ", deletedCoordinate})
    return
  } catch (error){
    console.log("Erro ao deletar usuário: ", error)
    res.status(500).json({message: "Um erro inesperado ocorreu: ", error})
    return
  }
}