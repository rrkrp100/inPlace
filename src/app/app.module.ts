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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu'
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { RoomDataComponent } from './poker-room/room-data/room-data.component';
import {MatIconModule} from '@angular/material/icon'; 
import {MatTooltipModule} from '@angular/material/tooltip'; 

@NgModule({
  declarations: [
    AppComponent,
    FormatJsonComponent,
    NotesComponent,
    PokerComponent,
    PokerRoomComponent,
    RoomDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [PokerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
