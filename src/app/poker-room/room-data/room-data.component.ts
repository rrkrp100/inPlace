import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { User } from 'src/app/interfaces/poker';
import { PokerService } from 'src/app/services/poker.service';
import { PokerRoomComponent } from '../poker-room.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from './snack/snack.component';
@Component({
  selector: 'app-room-data',
  templateUrl: './room-data.component.html',
  styleUrls: ['./room-data.component.scss'],
})
export class RoomDataComponent implements OnInit {
  roomKey: string = 'Loading Room Details...';
  isManager = false;
  users: User[] = [];
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<PokerRoomComponent>,
    private pokerService: PokerService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.roomKey = this.pokerService.roomKey;
    this.isManager = this.pokerService.isManager;
    this.pokerService.pokerRoom.subscribe((room) => {
      this.users = room.users.filter((x) => x.willNotVote);
    });
  }
  deleteRoom() {
    this.pokerService.deleteDocAndExit();
  }
  exitRooom() {
    this.pokerService.exitRooom();
  }
  makeManager(name: string) {
    const user = this.users.find((x) => x.name === name);
    if (user) {
      user.isManager = true;
      this.pokerService.updateUser(user);
    }
  }
  removeUser(usserName: string) {
    this.pokerService.removeUser(usserName);
  }
  openSnackBar() {
    this._snackBar.openFromComponent(SnackComponent, {
      duration: 1000,
      panelClass:'toast-class'
    });
  }
}

