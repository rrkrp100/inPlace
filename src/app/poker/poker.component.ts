import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Poker, User } from '../interfaces/poker';
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
  loading=false;
  constructor(
    private pokerStore: PokerService,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    var pokerKey = localStorage.getItem('pokerKey');
    this.activatedRoute.queryParams.subscribe(params => {
      pokerKey = params['rid'];  // Check url for room id 
  });
  if(!pokerKey){
    pokerKey = localStorage.getItem('pokerKey');
  }
    if (pokerKey && pokerKey.length > 0) {
      this.joinRoom(pokerKey);
    }
    this.loading=false;
  }

  joinRoom(key: string) {
    if (key.trim().length > 0) {
      this.loading=true;
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
          alert(error);
        }
      );
    }
  }

  createSession() {
    const newPoker: Poker = { story: '', users: [], showVotes: false };
    this.loading=true;
    this.pokerStore.createRoom(newPoker).subscribe((id) => {
      this.joinRoom(id);
    });
  }
}
