import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { ReturnStatement } from '@angular/compiler';

import { GLOBAL } from './global';
import { User } from '../models/user';
import { Song } from '../models/song';

@Injectable()
export class SongService {
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
     * CreateSong
     */
    public CreateSong(token: string, songtoAdd: Song) {
        this.addAuhtorzationHeader(token);
        return this.http.post<Song>(`${this.url}song`, songtoAdd, this.headers);
    }

    /**
     * getSong
     */
    public getSong(token: string, id: string) {
        this.addAuhtorzationHeader(token);
        return this.http.get<Song>(`${this.url}song/${id}`, this.headers);
    }

    /**
     * getSongs
     */
    public getSongs(token: string, albumId: string = null) {
        this.addAuhtorzationHeader(token);
        if (albumId == null) {
            return this.http.get <Song[]>(`${this.url}songs`, this.headers);
        } else {
            return this.http.get<Song[]>(`${this.url}songs/${albumId}`, this.headers);
        }
    }

    /**
     * updateSong
     */
    public updateSong(token: string , songUpdate: Song) {
        this.addAuhtorzationHeader(token);
        return this.http.put<Song>(`${this.url}song/${songUpdate._id}`, songUpdate, this.headers);
    }


    /**
     * deleteSong
     */
    public deleteSong(token: string, id: string) {
        this.addAuhtorzationHeader(token);
        return this.http.delete<Song>(`${this.url}song/${id}`, this.headers);
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