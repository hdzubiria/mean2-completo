import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public Title: string;
    public artist: Artist;
    public album: Album;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private artistSevice: ArtistService,
        private albumSevice: AlbumService
    ) {
        this.Title = 'Crear nuevo Álbum';
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', '', 2019, '', '');
        this.route.params.forEach((params: Params) => {
            this.album.artist = params.artist;
        });
    }

    ngOnInit(): void {
        console.log('album-add.components.ts Cargado');
    }

    /**
     * onSubmit
     */
    public onSubmit() {
        this.albumSevice.CreateAlbum(this.token, this.album)
        .subscribe(
            newAlbum => {
                const albumStored: Album = newAlbum;
                if (!albumStored._id) {
                    this.alertMessage = 'NO fue posible Crear el Album';
                } else {
                    this.alertMessage = 'Nuevo Álbum Creado Exitosamente';
                    this.album =  albumStored;
                    // this.router.navigate(['/editar-artista', this.artist._id]);
            }
          },
          erroresponse => {
            console.log(erroresponse.error.message);
            this.alertMessage = erroresponse.error.message;
          }
        );

    }
}

