import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Poker, User } from '../interafces/poker';
import { PokerService } from '../services/poker.service';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss'],
})
export class PokerComponent implements OnInit {
  sessionId: string = '';
  isRoomReady = false;
  users: User[] = [];

  constructor(
    private pokerStore: PokerService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const pokerKey = localStorage.getItem('pokerKey');
    if (pokerKey && pokerKey.length > 0) {
      this.joinRoom(pokerKey);
    }
  }

  joinRoom(key: string) {
    if (key.trim().length > 0) {
      this.sessionId = key.trim();
      this.pokerStore.joinRoom(this.sessionId).subscribe(
        (joined) => {
          if (joined) {
            localStorage.setItem('pokerKey', this.sessionId);
            this.isRoomReady = true;
            this.cd.detectChanges();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  createSession() {
    const newPoker: Poker = { story: '', users: [], showVotes: false };
    this.pokerStore.createSession(newPoker).then((ref) => {
      this.joinRoom(ref.id);
    });
  }
}
