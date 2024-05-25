import { Tag } from "../../Store/taskStore";

export type AuthData = {
    _id: string;
    name: string;
    token: string;
    email: string;
    email_verified?: boolean;
    picture: string;
    tags?: Tag[]
    filter?:string
  };

export type otherUser = {
  _id: string;
  name: string;
  picture: string;
}
  

export interface ErrorResponse {
    code?: string;
    message?: string;
}