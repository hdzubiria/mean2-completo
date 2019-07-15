import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';

import { GLOBAL } from './global';
import { ReturnStatement } from '@angular/compiler';
import { User } from '../models/user';

@Injectable()

export class UserService{
    public url: string;
    public identity;
    public token;
    private headers: { headers: HttpHeaders };

    constructor(private _http: HttpClient) {
        this.url=GLOBAL.url;
        this.headers = { headers:
            new HttpHeaders()
                .set('Content-Type', 'application/json')
        };
    }

    /**
     * Signup
     */
    public Signup(usertoLogin: User) {

        return this._http.post<User>(`${this.url}Login`, usertoLogin, this.headers);
    }

    /**
     * GetHash
     */
    public GetHash( user) {
        user.gethash = 'true';

        return this._http.post(`${this.url}Login`, user, this.headers);

    }

    /**
     * Resgister
     */
    public Register(usertoRegister: User) {

        return this._http.post<User>(`${this.url}register`,usertoRegister, this.headers);
    }

    /**
     * UpdateUser
     */
    public UpdateUser(usertoUpdate:User) {
        this.addAuhtorzationHeader();
        return this._http.put<User>(
                    `${this.url}update-user/${usertoUpdate._id}`
                    , usertoUpdate
                    , this.headers
        );
    }

    /**
     * getIdentity
     */
    public getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity!='undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    /**
     * getToken
     */
    public getToken() {
        const token = localStorage.getItem('token');
        if (token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

    /**
     * addAuhtorzationHeader()
     */
    private addAuhtorzationHeader() {
        this.headers = { 
            headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
                    .set('Authorization', this.getToken())
        };
    }

}