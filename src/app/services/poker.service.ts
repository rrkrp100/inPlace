import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Poker } from '../interafces/poker';
@Injectable({
  providedIn: 'root',
})
export class PokerService {
  private sessionDocument: AngularFirestoreDocument<Poker> =
    {} as AngularFirestoreDocument<Poker>;

  pokerRoom = new BehaviorSubject<Poker>({
    story: '',
    users: [],
    showVotes: false,
  });

  private snapshots: any;

  constructor(private firestore: AngularFirestore) {}

  joinRoom(sessionId: string): Observable<boolean> {
    const documentId = 'poker/' + sessionId;
    return new Observable((observer) => {
      this.sessionDocument = this.firestore.doc<Poker>(documentId);

      this.sessionDocument.snapshotChanges().subscribe(
        (data) => {
          if (data.type === 'removed') {
            this.deleteDocAndExit();
          }
          const roomData = data.payload.data();
          if (roomData) {
            this.pokerRoom.next(roomData);
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
    });
  }

  createSession(pokerRoom: Poker): Promise<any> {
    return this.firestore.collection('poker').add(pokerRoom);
  }

  updateRoom(newRoom: Poker) {
    this.sessionDocument.update(newRoom);
  }
  deleteDocAndExit() {
    this.sessionDocument.delete().then(() => {
      localStorage.removeItem('pokerKey');
      localStorage.removeItem('userName');
      location.reload();
    });
  }
}
