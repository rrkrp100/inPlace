import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Poker, User } from '../interfaces/poker';
@Injectable({
  providedIn: 'root',
})
export class PokerService {
  roomKey = 'Loading Room Key';
  isManager = false;
  private usersData: any;
  private sessionDocument: AngularFirestoreDocument<Poker> =
    {} as AngularFirestoreDocument<Poker>;
  private snapshots: any;
  private roomState: Poker = {
    story: '',
    users: [],
    showVotes: false,
  };

  pokerRoom = new BehaviorSubject<Poker>({
    story: '',
    users: [],
    showVotes: false,
  });

  constructor(private firestore: AngularFirestore) {}

  joinRoom(roomKey: string): Observable<boolean> {
    this.roomKey = roomKey;
    const documentId = 'poker/' + roomKey;
    return new Observable((observer) => {
      this.sessionDocument = this.firestore.doc<Poker>(documentId);

      this.sessionDocument.snapshotChanges().subscribe(
        (data) => {
          if (data.type === 'removed') {
            this.deleteDocAndExit();
          }
          const roomData = data.payload.data();
          if (roomData) {
            this.roomState.showVotes = roomData.showVotes;
            this.roomState.story = roomData.story;
            this.pokerRoom.next(this.roomState);
            observer.next(true);
          } else {
            observer.next(false);
          }
        },
        (error) => {
          console.log(error);
          return false;
        }
      );

      this.sessionDocument
        .collection('users', (ref) => ref.where('name', '!=', 'default'))
        .valueChanges()
        .subscribe((docs) => {
          const userArray: User[] = [];
          docs.forEach((doc) => {
            userArray.push({
              name: doc.name,
              hasVoted: doc.hasVoted,
              point: doc.point,
              isManager: doc.isManager,
              willNotVote: doc.willNotVote,
            });
          });
          this.roomState.users = userArray;
          this.pokerRoom.next(this.roomState);
        });
    });
  }

  createSession(pokerRoom: Poker): Observable<any> {
    return new Observable((observer) => {
      this.isManager = true;
      this.firestore
        .collection('poker')
        .add(pokerRoom)
        .then((document) => {
          this.sessionDocument = this.firestore.doc<Poker>(
            'poker/' + document.id
          );
          this.roomKey = document.id;
          const user: User = {
            name: 'default',
            hasVoted: false,
            point: 0,
            isManager: false,
          };
          this.sessionDocument
            .collection('users')
            .doc<User>('default')
            .set(user);
          observer.next(document.id);
        });
    });
  }

  updateRoom(newRoom: Poker) {
    this.sessionDocument.update({
      story: newRoom.story,
      showVotes: newRoom.showVotes,
    });
  }
  deleteDocAndExit() {
    this.sessionDocument.delete().then(() => {
      this.exitRooom();
    });
  }

  exitRooom() {
    var user = localStorage.getItem('userName') as string;
    this.removeUser(user);
    localStorage.removeItem('pokerKey');
    localStorage.removeItem('userName');
    location.reload();
  }

  removeUser(userName:string){
    this.sessionDocument.collection('users').doc<User>(userName).delete()
  }

  updateUser(user: User) {
    this.sessionDocument.collection('users').doc<User>(user.name).set(user);
  }
  resetUsers() {
    this.roomState.users.forEach((user) => {
      this.sessionDocument
        .collection('users')
        .doc<User>(user.name)
        .update({ hasVoted: false, point: 0 });
    });
  }
}
