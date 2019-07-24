import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})
export class SongAddComponent implements OnInit {
    public Title: string;
    public song: Song;
    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private songService: SongService,
    ) {
        this.Title = 'Crear nueva Canción';
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(0, 1, '', 0, '', '');
        this.route.params.forEach((params: Params) => {
            this.song.album = params.album;
        });

     }

     ngOnInit() {
        console.log('song-add.components.ts Cargado');
    }


    /**
     * onSubmit
     */
    public onSubmit() {
        console.log(this.song);
        this.songService.CreateSong(this.token, this.song)
        .subscribe(
            newSong => {
                const songStored: Song = newSong;
                if (!songStored._id) {
                    this.alertMessage = 'NO fue posible Crear la Canción';
                } else {
                    this.alertMessage = 'Nueva Canción Creada Exitosamente';
                    this.song =  songStored;
                    this.router.navigate(['/editar-cancion', this.song._id]);
            }
          },
          erroresponse => {
            console.log(erroresponse.error.message);
            this.alertMessage = erroresponse.error.message;
          }
        );

    }
}
