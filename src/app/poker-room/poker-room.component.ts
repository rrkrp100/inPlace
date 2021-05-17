import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  @Input() sessionId?: string = '';

  @ViewChild('name', { static: true }) userNameField: any;

  
  
  sessionDocument: AngularFirestoreDocument<Poker> =
    {} as AngularFirestoreDocument<Poker>;
  displayPoints = false;
  users: User[] = [];
  allowedPoints: number[] = [0, 1, 2, 3, 5, 8, 13];
  userName = '';
  hasUserDetails = false;
  selectedPoint: number = -1;
  storyText='';
  timer:any;
  constructor(
    private firestore: AngularFirestore,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('userName');
    if (user && user.length > 0) {
      this.userName = user;
      this.userNameField.nativeElement.value=this.userName;
      this.hasUserDetails = true;
      const point = this.users.find((element) => element.name === user)?.point;
      if (point) {
        this.selectedPoint = point;
        this.selectPoint(this.selectedPoint);
      }
    }
    try {
      // this.sessionId = '1234';
      const documentId = 'poker/' + this.sessionId;
      this.sessionDocument = this.firestore.doc<Poker>(documentId);
      this.sessionDocument.valueChanges().subscribe(
        (data) => {
          if (data) {
            this.storyText=data.story;
            this.users = data.users;
            this.cd.detectChanges();
          } else {
            alert('Room Closed');
            this.exitToMainPage();
          }
        },
        (eeror) => {
          alert('Room Closed');
          this.exitToMainPage();
        }
      );
    } catch (error) {
      alert('Room Closed');
      this.exitToMainPage();
    }
  }

  submit(name: string, points: number) {
    const user = this.users.find((x) => x.name === name);
    if (user) {
      user.point = points;
      user.hasVoted = true;
      const newPoker: Poker = {story:this.storyText, users: this.users };
      this.sessionDocument.update(newPoker);
    }
  }
  addUser(receivedName: string) {
    const name = receivedName.trim();
    if (name.length < 1) {
      alert('Please Enter a Valid Name');
      return;
    }
    if (this.users.find((user) => user.name === name)) {
      alert('Please Enter an Unique Name');
      return;
    }

    const newUser: User = { name, hasVoted: false, point: 0 };
    this.users.push(newUser);
    const newPoker: Poker = { story:this.storyText,users: this.users };
    this.sessionDocument.update(newPoker);
    this.userName = name;
    this.hasUserDetails = true;
    localStorage.setItem('userName', this.userName);
  }
  showPoints() {
    this.displayPoints = true;
  }
  selectPoint(point: number) {
    if(this.displayPoints){
      alert('Cannot Change points after flipping cards');
      return;
    }
    this.selectedPoint = point;
    this.submit(this.userName, this.selectedPoint);
    this.cd.detectChanges();
  }
  isSelected(point: number) {
    if (this.hasUserDetails) {
      if (point == this.selectedPoint) {
        return 'card point isSelected';
      }
      return 'card point';
    } else {
      return 'card disabled';
    }
  }
  exitToMainPage() {
    this.firestore.doc('poker/' + this.sessionId).delete().then();
    localStorage.removeItem('pokerKey');
    localStorage.removeItem('userName');
    location.reload();
  }
  nextStory() {
    this.displayPoints = false;
    this.users.forEach((user) => {
      user.hasVoted = false;
      user.point = 0;
    });
    this.selectedPoint=-1;
    this.storyText='';
    const newPoker: Poker = { story:this.storyText,users: this.users };
    this.sessionDocument.update(newPoker);
  }

  updateStory(value:string){
      if(this.timer){
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(()=>{
      this.storyText=value;
      const newPoker: Poker = { story:this.storyText,users: this.users };
      this.sessionDocument.update(newPoker);
      console.log(this.storyText);
    },1000);
  }
}
