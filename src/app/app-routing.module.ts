import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormatJsonComponent} from './format-json/format-json.component';
import {NotesComponent} from './notes/notes.component';
const routes: Routes = [
  { path: 'format', component: FormatJsonComponent },              
  { path: 'notes', component: NotesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
