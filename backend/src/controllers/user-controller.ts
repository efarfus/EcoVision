import jwt from 'jsonwebtoken'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/user-repository';
import { NextFunction, Request, Response } from 'express';

const { validationResult } = require('express-validator');



const userRepository = new UserRepository();
const prisma = new PrismaClient

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {
    const users = await userRepository.getAllUsers();

    const usersJson = JSON.parse(JSON.stringify(users, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    res.status(200).json({usersJson});
    return
  } catch (error) {
    console.log("Erro ao localizar usuários: ", error)
    res.status(500).send('Fetching users failed, please try again later.'); 
    return
  }
};

export const getUserIdByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {email} = req.body

    if(!email){
      res.status(404).json({message: 'email ausente'})
      return
    }

    const user = await userRepository.getUserByEmail(email);

    if(!user){
      res.status(404).json({message: 'usuario nao encontrado'})
      return
    }
    
    const userId = user.id

    res.status(200).json({userId});
    return
  } catch (error) {
    console.log("Erro ao localizar usuários: ", error)
    res.status(500).send('Fetching users failed, please try again later.'); 
    return
  }
};

export const signupByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send("Invalid Input detected, please verify your data");
    return
  }

  const { email, password, name } = req.body;

  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      res.status(422).send("This email is already in use!");
      return
    }
    
    const saltRounds = 10

    /*const hashPassword = async (password: any) => {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    };
    
    const hashedPassword = await hashPassword(password);*/

    const createdUser = await userRepository.createUser(
      email,
      password,
      name,
    );

    const token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h', 
    });

    res.status(201).json({ token });
    return
  } catch (error) {
    console.error("An error ha occured during signup: ", error)
    res.status(500).send('Signing up failed, please try again later.');
    return
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //const userId = req.userId
  const { name, password, email, userId } = req.body

  try{

    if(!userId){
      res.status(400).json({message: 'Invalid ID'})
      return
    }

    const identifiedUser = await userRepository.getUserById(userId)

    if(!identifiedUser){
      res.status(404).json({message: 'User not found!'})
    }

    await userRepository.updateUser(userId, {
      name,
      password,
      email,
    })  
    

    res.status(200).json({message: "User updated"})
    return

  } catch(err){
    console.error("Error: ", err)
    res.status(500).json({message: "An unexpected error has occured"})
    return
  }
}


export const getUserWithToken = async(req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
  const userId = req.userId;

  if(!userId){
    return res.status(404).json('Usuário não encontrado')
  }

  try{
    const identifiedUser = await userRepository.getUserById(userId)

    if(!identifiedUser){
      return res.status(404).json('Usuário não localizado')
    }
    const identifiedUserJson = JSON.parse(JSON.stringify(identifiedUser, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  
    return res.status(200).json({identifiedUserJson})
  } catch(err){
    res.status(500).json(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const identifiedUser = await userRepository.getUserByEmail(email);
    console.log(identifiedUser)

    if (!identifiedUser) {
      res.status(401).send("Usuário não encontrado, verifique sua senha e email!")
      return
    }

    /*const isPasswordValid = await bcrypt.compare(password, identifiedUser.password);
    console.log(isPasswordValid)
      if (!isPasswordValid) {
        res.status(401).send("Usuário não encontrado, verifique sua senha e email!")
        return
      }*/


    const token = jwt.sign({ userId: identifiedUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h', 
    });

    res.status(200).json({ token });
    return
  } catch (error) {
    console.log('Logging in failed with following error: ', error)
    res.status(500).send('Logging in failed, please try again later.');
    return
  }
};

export const deleteUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const { userId } = req.params

    const deletedUser = await userRepository.deleteUser(userId)

    if(!deletedUser){
      res.status(404).json({message: "Usuário não encontrado"})
      return
    }

    res.status(200).json({message: "Usuário deletado com sucesso: ", deletedUser})
    return
  } catch (error){
    console.log("Erro ao deletar usuário: ", error)
    res.status(500).json({message: "Um erro inesperado ocorreu: ", error})
    return
  }
}