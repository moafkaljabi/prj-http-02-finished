import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { error } from "protractor";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email:string,
    refreshToken: string,
    expiresIn: string,
    localId: string
    registered?: boolean
}

@Injectable({providedIn:'root'})
export class AuthServices {
    constructor(private http:HttpClient,) {}
    signup(email:string, password:string){
       return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCILqxCAyaKWmaNI9icpNMTXTZiCMGLFSw'
            ,{
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe( 
                catchError( this.handleError)

                );
    }

    login(email: string, password:string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCILqxCAyaKWmaNI9icpNMTXTZiCMGLFSw'
            ,{
                email: email,
                password: password,
                returnSecureToken : true
            }
            ).pipe(
                catchError(this.handleError)
            )
    };

    private handleError(errorRes: HttpErrorResponse){
            let errorMessage = "An unknown error occured!";
            if(!errorRes.error || !errorRes.error.error){
                return throwError(errorMessage);
            }
            switch (errorRes.error.error.message){
                case 'EMAIL_EXISTS':
                    errorMessage ='This email already exists';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'This email is not registered';
                    break;
            }
            return throwError(errorMessage);
        }
    
}