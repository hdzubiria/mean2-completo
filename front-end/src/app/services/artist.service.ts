import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { ReturnStatement } from '@angular/compiler';

import { GLOBAL } from './global';
import { User } from '../models/user';
import { Artist } from '../models/artist';

@Injectable()

export class ArtistService {
    public url: string;
    private headers: { headers: HttpHeaders };

    constructor(private http:HttpClient) {
        this.url = GLOBAL.url;
        this.headers = { headers:
            new HttpHeaders()
                .set('Content-Type', 'application/json')
        };
    }

    /**
     * CreateArtist
     */
    public CreateArtist(token: string , artisttoAdd: Artist) {
        this.addAuhtorzationHeader(token);
        return this.http.post<Artist>(`${this.url}artist`, artisttoAdd, this.headers);
    }

    /**
     * getArtists
     */
    public getArtists(token: string, page: string) {
        this.addAuhtorzationHeader(token);
        return this.http.get(`${this.url}artists/${page}`, this.headers);
    }

    /**
     * getArtist
     */
    public getArtist(token: string, id: string) {
        this.addAuhtorzationHeader(token);
        return this.http.get<Artist>(`${this.url}artist/${id}`, this.headers);
    }

    /**
     * updateArtist
     */
    public updateArtist(token: string , artisttoUpdate: Artist) {
        this.addAuhtorzationHeader(token);
        return this.http.put<Artist>(`${this.url}artist/${artisttoUpdate._id}`, artisttoUpdate, this.headers);
    }

    /**
     * deleteArtist
     */
    public deleteArtist(token: string, id: string) {
        this.addAuhtorzationHeader(token);
        return this.http.delete<Artist>(`${this.url}artist/${id}`, this.headers);
    }

    //#region Metodos Privados

    /**
     * addAuhtorzationHeader
     */
    private addAuhtorzationHeader(token: string) {
        this.headers = {
            headers : new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
        }
    }

    //#endregion

}