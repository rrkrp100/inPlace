import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PokerService } from 'src/app/services/poker.service';
import { PokerRoomComponent } from '../poker-room.component';
@Component({
  selector: 'app-room-data',
  templateUrl: './room-data.component.html',
  styleUrls: ['./room-data.component.scss'],
})
export class RoomDataComponent implements OnInit {
  roomKey:string = 'Loading Room Details...'
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<PokerRoomComponent>,
    private pokerService: PokerService
  ) {}

  ngOnInit(): void {}
}
