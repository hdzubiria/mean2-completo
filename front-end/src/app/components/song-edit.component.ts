import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})
export class SongEditComponent implements OnInit {
    public Title: string;
    public isEdit: boolean;
    public song: Song;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string;
    public filesToUpload: Array<File>;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private songService: SongService,
        private uploadService: UploadService
    ) {
        this.Title = 'Editar Canción';
        this.isEdit = true;
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(0, 1, '', 0, '', '');

     }

     ngOnInit() {
        console.log('song-edit.components.ts Cargado');
        // Conseguir la canción
        this.getSong();
    }


    /**
     * onSubmit
     */
    public onSubmit() {
        this.songService.updateSong(this.token, this.song)
        .subscribe(
            songUpdate => {
                const songUpdated: Song = songUpdate;
                if (!songUpdated._id) {
                    this.alertMessage = 'NO fue posible actualizar la canción';
                } else {
                     // Cargar Imagen si se ha seleccionado
                    if (this.filesToUpload) {
                        this.uploadService.makeFileRequest(
                                `${this.url}upload-file-song/${this.song._id}`,
                                [],
                                this.filesToUpload,
                                this.token,
                                'file'
                        )
                        .then((result) => {
                            this.song.file = (result as any).file;
                            const imagePath = this.url + 'get-file-song/' + this.song.file;
                        });
                    }
                    this.router.navigate(['/album', (this.song.album as Album)._id]);
                    this.alertMessage = 'Canción actualizada Exitosamente';
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
     * getSong
     */
    private getSong() {
        this.route.params.forEach((param: Params) => {
            const id: string = param.id;
            this.songService.getSong(this.token, id)
            .subscribe(
                song => {
                    if (!song) {
                        this.router.navigate(['/']);
                    } else {
                        this.song = song;
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
