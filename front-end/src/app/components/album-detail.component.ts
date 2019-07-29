import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';
import { Artist } from '../models/artist';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, AlbumService, SongService]

})

export class AlbumDetailComponent implements OnInit {
    public album: Album;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string;
    public songs: Song[];
    public confirmado: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private albumService: AlbumService,
        private songService: SongService
    ) {
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('album-detail.components.ts Cargado');
        // cargar artistea en base a su id
        this.getAlbum();
    }

    /**
     * getAlbum
     */
    public getAlbum() {

        this.route.params.forEach((param: Params) => {

            const id: string = param.id;

            this.albumService.getAlbum(this.token, id)
            .subscribe(
                album => {
                    if (!album) {
                        this.router.navigate(['/']);
                    } else {
                        this.album = album;
                        // TODO: Cargar las Cancciones

                        this.songService.getSongs(this.token, album._id)
                        .subscribe(
                            cancionesRecibidas => {
                                if (!cancionesRecibidas) {
                                    this.alertMessage = 'Este Álbum no tiene Cancciones';
                                } else {
                                    this.songs = cancionesRecibidas;
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
     * onCancelDeleteSong
     */
    public onCancelDeleteSong() {
        this.confirmado = null;
    }

    /**
     * onDeleteSong
     */
    public onDeleteSong(id: string) {
        this.songService.deleteSong(this.token, this.confirmado)
        .subscribe(
            deletedSong => {
                if (!deletedSong._id) {
                    console.log('ERROR: Canción no Borrada');
                }
                this.getAlbum();
            },
            erroresponse => {
                console.log(erroresponse.error.message);
            }
        );
    }

    /**
     * startPlayer
     */
    public startPlayer(song:Song) {
        let songPlayed = JSON.stringify(song);
        let filePath = `${this.url}get-file-song/${song.file}`;
        let imagePath = `${this.url}get-image-album/${song.album.image}`;

        localStorage.setItem('sound_song', songPlayed);

        document.getElementById('mp3-source').setAttribute('src', filePath);
        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();

        document.getElementById('play-song-title').innerHTML = song.nombre;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src', imagePath);

    }

}
