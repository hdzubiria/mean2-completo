import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL} from '../services/global';
import { UserService} from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';


@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public Title: string;
    public artists: Artist[];
    public identity: any;
    public token: any;
    public url: string;
    public nextPage: number; 
    public prevPage: number;
    public confirmado: string;

    constructor(
        private route:ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private artistService: ArtistService
    ) {
        this.Title = 'Artistas';
        this.identity = userService.getIdentity();
        this.token = userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('artist-list.components.ts Cargado');
        // OJO FALTA: Cargar el listado de Artistas
        this.getArtists();
    }

    /**
     * getArtists
     */
    public getArtists() {

        this.route.params.forEach((param: Params) => {
            let page = 1;
            if (param.page) {
                page = +param.page;
                this.nextPage = page + 1;
                this.prevPage = page - 1;
                if(this.prevPage === 0) {
                    this.prevPage = 1;
                }
            }

            this.artistService.getArtists(this.token, page.toString())
            .subscribe(
                response => {
                    const artistas = (response as any).artists;
                    if (!artistas) {
                        this.router.navigate(['/']);
                    } else {
                        this.artists = artistas;
                    }
                },
                erroresponse => {
                    console.log(erroresponse.error.message);
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
     * onCancelDeleteArtist
     */
    public onCancelDeleteArtist() {
        this.confirmado = null;
    }

    /**
     * onDeleteArtist
     */
    public onDeleteArtist(id: string) {
        this.artistService.deleteArtist(this.token, this.confirmado)
        .subscribe(
            deletedArtist => {
                if (!deletedArtist._id) {
                    console.log('ERROR: Artista no Borrado');
                }
                this.getArtists();
            },
            erroresponse => {
                console.log(erroresponse.error.message);
            }
        );
    }

}
