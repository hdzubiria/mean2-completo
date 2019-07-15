import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';


@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public Title: string;
    public isEdit: boolean;
    public artist: Artist;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string;
    public filesToUpload: Array<File>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private artistService: ArtistService,
        private uploadService: UploadService
    ) {
        this.Title = 'Actualizar artista';
        this.isEdit = true;
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '');
    }

    ngOnInit() {
        console.log('artist-edit.components.ts Cargado');

        // cargar artistea en base a su id
        this.getArtist();
    }

    /**
     * onSubmit
     */
    public onSubmit() {
        this.artistService.updateArtist(this.token, this.artist)
        .subscribe(
            editedArtist => {
                const artistStored: Artist = editedArtist;
                if (!artistStored._id) {
                    this.alertMessage = 'NO fue posible Actualizar el Artista';
                } else {
                    // Cargar Imagen si se ha seleccionado
                    if (this.filesToUpload) {
                        this.uploadService.makeFileRequest(
                                `${this.url}upload-image-artist/${this.artist._id}`,
                                [],
                                this.filesToUpload,
                                this.token,
                                'image'
                        )
                        .then((result) => {
                            this.artist.image = (result as any).image;
                            const imagePath = this.url + 'get-image-user/' + this.artist.image;
                            this.router.navigate(['/artistas', 1]);
                        });
                        this.alertMessage = 'Artista Actualizado Exitosamente';
                    }
                }
            },
            erroresponse => {
                console.log(erroresponse.error.message);
                this.alertMessage = erroresponse.error.message;
            }
        );
    }

    /**
     * fileChangeEvent
     */
    public fileChangeEvent(fileInput: any) {
        this.filesToUpload = fileInput.target.files as Array<File>;
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
