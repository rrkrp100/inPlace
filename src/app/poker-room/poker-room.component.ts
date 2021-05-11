import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { error } from 'selenium-webdriver';
import { Poker, User } from '../interafces/poker';
@Component({
  selector: 'app-poker-room',
  templateUrl: './poker-room.component.html',
  styleUrls: ['./poker-room.component.scss'],
})
export class PokerRoomComponent implements OnInit {
  @Input() sessionId: string = '';
  @Input()
  sessionDocument: AngularFirestoreDocument<Poker> = {} as AngularFirestoreDocument<Poker>;
  showPoints=false;
  users: User[] = [
    { name: 'dummy', hasVoted: false, point: 1 },
    { name: 'dummy', hasVoted: false, point: 0 },
    { name: 'dummy', hasVoted: true, point: 2 },
    { name: 'dummy', hasVoted: false, point: 1 },
    { name: 'dummy', hasVoted: false, point: 0 },
    { name: 'dummy', hasVoted: false, point: 2 },

  ];

  hasUserDetails = false;

  constructor(
    private firestore: AngularFirestore,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    try {
      this.sessionId ='1234';
      const documentId = 'poker/' + this.sessionId;
      this.sessionDocument = this.firestore.doc<Poker>(documentId);
      this.sessionDocument.valueChanges().subscribe((data) => {
        if (data) {
          this.users = data.users;
          this.cd.detectChanges();
        }else{
          alert("Could Not retrive data")
        }
      },
      (eeror)=>{alert("Could Not retrive data")});
    } catch (error) {
      alert("Could Not retrive data");
      this.cd.detectChanges();
    }
  }

  submit(name: string, points: string) {
    const user = this.users.find((x) => x.name === name);
    if (user) {
      user.point = (points as unknown) as number;
      const newPoker: Poker = { users: this.users };
      this.sessionDocument.update(newPoker);
    }
  }
  addUser(name: string) {
    const newUser: User = { name, hasVoted: false, point: 0 };
    this.users.push(newUser);
    const newPoker: Poker = { users: this.users };
    this.sessionDocument.update(newPoker);
  }
}
