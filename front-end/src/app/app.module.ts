import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { routing, appRoutingProviders} from './app.routing';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';

import { UserEditComponent } from './components/user-edit.component';

import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

import { AlbumAddComponent } from './components/album-add.component';


@NgModule({
  declarations: [
    AppComponent
    , HomeComponent
    , UserEditComponent
    , ArtistListComponent
    , ArtistAddComponent
    , ArtistEditComponent
    , ArtistDetailComponent
    , AlbumAddComponent
  ],
  imports: [
    BrowserModule
    , HttpClientModule
    , FormsModule
    , routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
