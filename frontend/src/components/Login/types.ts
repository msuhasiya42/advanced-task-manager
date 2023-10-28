
export type User = {
    userId: string;
    name: string;
    token: string;
    email: string;
    email_verified?: boolean;
    given_name?: string;
    family_name?: string;
    locale?: string;
    picture: string;
    tags?:string[]
    // ... any other properties from your user object ...
  };
  

export interface ErrorResponse {
    code?: string;
    message?: string;
}