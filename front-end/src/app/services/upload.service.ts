import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/observable';
import { ReturnStatement } from '@angular/compiler';


import { GLOBAL } from './global';
import { User } from '../models/user';
import { Artist } from '../models/artist';

@Injectable()
export class UploadService {
    public url: string;
    private headers: { headers: HttpHeaders };

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
        this.headers = { headers:
            new HttpHeaders()
                .set('Content-Type', 'application/json')
        };
    }

    /**
     * makeFileRequest
     */
    public makeFileRequest(
        url: string,
        params: Array<string>,
        files: Array<File>,
        token: string,
        name: string
    ) {

        return new Promise((resolve, reject) => {

          const formData: any = new FormData();
          const xhr = new XMLHttpRequest();

          for (let i = 0; i < files.length; i++) {
            formData.append(name, files[i], files[i].name);
          }

          xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
          };

          xhr.open('POST', url, true);
          xhr.setRequestHeader('Authorization', token);
          xhr.send(formData);
        });
    }

}
