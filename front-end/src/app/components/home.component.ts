import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'home',
    templateUrl: '../views/home.html',
})
export class HomeComponent implements OnInit {
    public Title: string;

    constructor(
        private route: ActivatedRoute,
        private router:Router
    ) {
        this.Title = 'Bienvenido a MUSIFY!!';
    }


    ngOnInit() {
        console.log('Home.component.ts ha inciado');
     }
}
