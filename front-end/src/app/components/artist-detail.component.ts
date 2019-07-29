import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]

})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string;
    public albums: Album[];
    public confirmado: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private artistService: ArtistService,
        private albumService: AlbumService
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

                        this.albumService.getAlbums(this.token, artist._id)
                        .subscribe(
                            albumesRecibidos => {
                                if (!albumesRecibidos) {
                                    this.alertMessage = 'Este Artista No tiene Álbumes';
                                } else {
                                    this.albums = albumesRecibidos;
                                }
                            },
                            erroresponse => {
                                console.log(erroresponse.error.message);
                                this.alertMessage = erroresponse.error.message;
                            }
                        );


                    }
                },
                erroresponse => {
                    console.log(erroresponse.error.message);
                    this.alertMessage = erroresponse.error.message;
                }
            );
        });
    }

    /**
     * onDeleteConfirm
     */
    public onDeleteConfirm(id: string) {
        this.confirmado = id;
    }

    /**
     * onCancelDeleteAlbum
     */
    public onCancelDeleteAlbum() {
        this.confirmado = null;
    }

    /**
     * onDeleteAlbum
     */
    public onDeleteAlbum(id: string) {
        this.albumService.deleteAlbum(this.token, this.confirmado)
        .subscribe(
            deletedAlbum => {
                if (!deletedAlbum._id) {
                    console.log('ERROR: Álbum no Borrado');
                }
                this.getArtist();
            },
            erroresponse => {
                console.log(erroresponse.error.message);
            }
        );
    }


}
