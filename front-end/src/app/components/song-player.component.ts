import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'song-player',
    template: `
     <div class="album-image">
         <span *ngIf="song.album">
             <img id="play-image-album" src="{{url+ 'get-image-album/' + song.album.image}}" alt="Imagen del Álbum">
         </span>
         <span *ngIf="!song.album">
             <img id="play-image-album" src="../../assets/images/default.png" alt="Imagen por defecto"/>
         </span>
     </div>
     <div class="audio-file">
         <p>Reproduciendo</p>
         <span id="play-song-title">
             {{song.nombre}}
         </span>
         |
         <span id="play-song-artist">
            <span *ngIf="song.album">
                {{song.album.artist.name}}
            </span>
         </span>
         <audio controls id="player">
            <source id="mp3-source" src="{{url+ 'get-file-song/' +song.file}}" type="audio/mpeg" alt="Archivo de la Canción"/>
                        El Navegador no soporta la reproducción de audio
        </audio>
     </div>
    `
})

export class SongPlayerComponent implements OnInit {
    public url: string;
    public song: Song;

    constructor() {
        this.url = GLOBAL.url;
    }
    
    ngOnInit() {
        console.log('Player Cargado');

        const tempSong = JSON.parse(localStorage.getItem('sound_song'));
        if (tempSong) {
            this.song = tempSong;
        } else {
            this.song = new Song( '', 1, '', 0, '', '');
        }

    }
}
