import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';


@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
    public Title: string;
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
        this.Title = 'Crear nuevo artista';
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '');
    }

    ngOnInit() {
        console.log('artist-add.components.ts Cargado');
    }

    /**
     * onSubmit
     */
    public onSubmit() {
        this.artistService.CreateArtist(this.token, this.artist)
        .subscribe(
            newArtist => {
                const artistStored: Artist = newArtist;
                if (!artistStored._id) {
                    this.alertMessage = 'NO fue posible Crear el Artista';
                } else {
                    this.alertMessage = 'Nuevo Artista Creado Exitosamente';
                    this.artist =  artistStored;
                    this.router.navigate(['/editar-artista', this.artist._id]);
            }
          },
          erroresponse => {
            console.log(erroresponse.error.message);
            this.alertMessage = erroresponse.error.message;
          }
        );
    }


}
