import { Request } from "express";

export interface userData {
    firstName:string, 
    LastName:string, 
    email:string, 
    password:string
}
export interface RegisterUserRquest extends Request{
    body : userData;
}