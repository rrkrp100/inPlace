import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { error } from 'selenium-webdriver';
import { Poker, User } from '../interafces/poker';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss'],
})
export class PokerComponent implements OnInit {
  sessionId: string = '';
  isRoomReady=false;
  users: User[] = [];
  sessionDocument: AngularFirestoreDocument<Poker>={} as AngularFirestoreDocument<Poker>;

  constructor(
    private firestore: AngularFirestore,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  joinRoom(key: string) {
    if (key.trim().length > 0) {
      this.sessionId = key.trim();
      const documentId = 'poker/' + this.sessionId;

      this.sessionDocument = this.firestore.doc<Poker>(documentId);
      this.sessionDocument.valueChanges().subscribe((data) => {
        if (data) {
          this.users = data.users;
          this.isRoomReady=true;
          this.cd.detectChanges();
        }else{
          alert('Please Check the Room Key');
          this.isRoomReady=false;
        }
      },
      (error)=>{
        alert('Please Check the Room Key');
        this.isRoomReady=false;
      });
    }else{
      alert('Please Check the Room Key');
      this.isRoomReady=false;
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
  createSession() {
    const defaultUser: User = { name: 'default', hasVoted: false, point: 0 };
    const newPoker: Poker = { users: [] };
    this.firestore
      .collection('poker')
      .add(newPoker)
      .then((ref) => {
        this.sessionId = ref.id;
      });
  }
}
