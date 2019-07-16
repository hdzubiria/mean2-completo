import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { ReturnStatement } from '@angular/compiler';

import { GLOBAL } from './global';
import { User } from '../models/user';
import { Album } from '../models/album';


@Injectable()
export class AlbumService {
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
     * CreateAlbum
     */
    public CreateAlbum(token: string, albumtoAdd: Album) {
        this.addAuhtorzationHeader(token);
        return this.http.post<Album>(`${this.url}album`, albumtoAdd, this.headers);
    }

    /**
     * getAlbum
     */
    public getAlbum(token: string, id: string) {
        this.addAuhtorzationHeader(token);
        return this.http.get<Album>(`${this.url}album/${id}`, this.headers);
    }

    /**
     * updateArtist
     */
    public updateAlbum(token: string , albumtoUpdate: Album) {
        this.addAuhtorzationHeader(token);
        return this.http.put<Album>(`${this.url}album/${albumtoUpdate._id}`, albumtoUpdate, this.headers);
    }

    /**
     * deleteAlbum
     */
    public deleteAlbum(token: string, id: string) {
        this.addAuhtorzationHeader(token);
        return this.http.delete<Album>(`${this.url}album/${id}`, this.headers);
    }

    /**
     * getAlbums
     */
    public getAlbums(token: string, artistId: string = null) {
        this.addAuhtorzationHeader(token);
        if (artistId == null) {
            return this.http.get <Album[]>(`${this.url}albums`, this.headers);
        } else {
            return this.http.get<Album[]>(`${this.url}albums/${artistId}`, this.headers);
        }
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