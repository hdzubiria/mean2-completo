import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService]

})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private artistService: ArtistService
    ) {
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('artist-detail.components.ts Cargado');
        // cargar artistea en base a su id
        this.getArtist();
    }

    /**
     * getArtist
     */
    public getArtist() {

        this.route.params.forEach((param: Params) => {

            const id: string = param.id;

            this.artistService.getArtist(this.token, id)
            .subscribe(
                artist => {
                    if (!artist) {
                        this.router.navigate(['/']);
                    } else {
                        this.artist = artist;

                        // TODO: Cargar los Albumes del Artista


                    }
                },
                erroresponse => {
                    console.log(erroresponse.error.message);
                    this.alertMessage = erroresponse.error.message;
                }
            );
        });
    }

}
