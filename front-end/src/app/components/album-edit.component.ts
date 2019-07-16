import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public Title: string;
    public isEdit: boolean;
    public album: Album;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string;
    public filesToUpload: Array<File>;

    


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private albumService: AlbumService,
        private uploadService: UploadService,
    ) {
        this.Title = 'Editar Álbum';
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
        this.isEdit = true;
        this.album = new Album('', '', '', 2019, '', '');
    }

    ngOnInit(): void {
        console.log('album-add.components.ts Cargado');
        // Conseguir el album
        this.getAlbum();
    }

    /**
     * onSubmit
     */
    public onSubmit() {
        this.albumService.updateAlbum(this.token, this.album)
        .subscribe(
            albumtoUpdate => {
                const albumUpdated: Album = albumtoUpdate;
                if (!albumUpdated._id) {
                    this.alertMessage = 'NO fue posible actualizar el Álbum';
                } else {
                     // Cargar Imagen si se ha seleccionado
                    if (this.filesToUpload) {
                        this.uploadService.makeFileRequest(
                                `${this.url}upload-image-album/${this.album._id}`,
                                [],
                                this.filesToUpload,
                                this.token,
                                'image'
                        )
                        .then((result) => {
                            this.album.image = (result as any).image;
                            const imagePath = this.url + 'get-image-album/' + this.album.image;
                        });
                    }
                    this.router.navigate(['/artista', (this.album.artist as Artist)._id]);
                    this.alertMessage = 'Álbum actualizado Exitosamente';
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
    private getAlbum() {
        this.route.params.forEach((param: Params) => {
            const id: string = param.id;
            this.albumService.getAlbum(this.token, id)
            .subscribe(
                album => {
                    if (!album) {
                        this.router.navigate(['/']);
                    } else {
                        this.album = album;
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

