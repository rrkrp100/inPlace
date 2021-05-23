import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormatJsonComponent } from './format-json/format-json.component';
import { NotesComponent } from './notes/notes.component';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { PokerComponent } from './poker/poker.component';
import { PokerRoomComponent } from './poker-room/poker-room.component';
import { PokerService } from './services/poker.service';
@NgModule({
  declarations: [
    AppComponent,
    FormatJsonComponent,
    NotesComponent,
    PokerComponent,
    PokerRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [PokerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
