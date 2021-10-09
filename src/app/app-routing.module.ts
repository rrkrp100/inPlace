import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormatJsonComponent } from './format-json/format-json.component';
import { NotesComponent } from './notes/notes.component';
import { PokerRoomComponent } from './poker-room/poker-room.component';
import { PokerComponent } from './poker/poker.component';
const routes: Routes = [
  { path: 'format', component: FormatJsonComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'poker', component: PokerComponent },
  { path: '', component: PokerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
