import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Poker, User } from '../interfaces/poker';
import { PokerService } from '../services/poker.service';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { RoomDataComponent } from './room-data/room-data.component';
@Component({
  selector: 'app-poker-room',
  templateUrl: './poker-room.component.html',
  styleUrls: ['./poker-room.component.scss'],
})
export class PokerRoomComponent implements OnInit {
  @Input() sessionId?: string = '';

  sessionDocument: AngularFirestoreDocument<Poker> =
    {} as AngularFirestoreDocument<Poker>;
  displayPoints = false;
  users: User[] = [];
  defaultUser: User[] = [];
  allowedPoints: number[] = [0, 1, 2, 3, 5, 8, 13];
  userName = '';
  isManager = false;
  hasUserDetails = false;
  selectedPoint: number = -1;
  storyText = '';
  timer: any;
  tipDelay = 1000;
  checked = false;
  showWaitingMsg = false;
  avgVotes = 0;
  constructor(
    private firestore: AngularFirestore,
    private cd: ChangeDetectorRef,
    private pokerService: PokerService,
    private _bottomSheet: MatBottomSheet
  ) {}

  showRoomData() {
    const bottomSheetRef = this._bottomSheet.open(RoomDataComponent, {
      ariaLabel: 'Room Info',
      panelClass: 'bottomSheet',
    });
  }

  ngOnInit(): void {
    const userName = localStorage.getItem('userName');
    if (userName && userName.length > 0) {
      this.userName = userName;
      this.hasUserDetails = true;
    }
    try {
      this.pokerService.pokerRoom.subscribe(
        (data) => {
          if (data) {
            this.storyText = data.story;
            this.users = data.users;
            this.displayPoints = data.showVotes;
            const user = this.users.find(
              (element) => element.name === this.userName
            );
            if (
              this.users.length ===
              this.users.filter((x) => x.willNotVote).length
            ) {
              this.showWaitingMsg = true;
            } else {
              this.showWaitingMsg = false;
            }
            if (user) {
              this.selectedPoint = user.point;
              this.isManager = this.users.length === 1 ? true : user.isManager;
              this.pokerService.isManager = this.isManager;
              this.cd.detectChanges();
            }
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

  updatePoints(name: string, points: number) {
    const user = this.users.find((x) => x.name === name);
    if (user) {
      user.point = points;
      user.hasVoted = true;
      this.pokerService.updateUser(user);
    }
  }
  makeManager(name: string) {
    const user = this.users.find((x) => x.name === name);
    if (user) {
      user.isManager = true;
      this.pokerService.updateUser(user);
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

    const newUser: User = {
      name,
      hasVoted: false,
      point: 0,
      isManager: this.pokerService.isManager,
      willNotVote: this.checked,
    };
    this.users.push(newUser);
    this.pokerService.updateUser(newUser);
    this.userName = name;
    this.hasUserDetails = true;
    this.isManager = this.pokerService.isManager;
    localStorage.setItem('userName', this.userName);
  }
  showPoints() {
    var sum = 0;
    var voters = 0;
    this.users.forEach((user) => {
      if (user.hasVoted && user.point > 0) {
        sum += user.point;
        voters++;
      }
    });
    this.avgVotes = sum > 0 ? (voters > 0 ? sum / voters : 0) : 0;
    this.displayPoints = true;
    const newPoker: Poker = {
      story: this.storyText,
      users: this.users,
      showVotes: this.displayPoints,
    };
    this.pokerService.updateRoom(newPoker);
  }
  selectPoint(point: number) {
    if (this.displayPoints) {
      alert('Cannot Change points after flipping cards');
      return;
    }
    this.selectedPoint = point;
    this.updatePoints(this.userName, this.selectedPoint);
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
    this.pokerService.deleteDocAndExit();
  }
  nextStory() {
    this.displayPoints = false;
    this.users.forEach((user) => {
      user.hasVoted = false;
      user.point = 0;
    });
    this.selectedPoint = -1;
    this.storyText = '';
    const newPoker: Poker = {
      story: this.storyText,
      users: this.users,
      showVotes: false,
    };
    this.pokerService.updateRoom(newPoker);
    this.pokerService.resetUsers();
  }

  updateStory(value: string) {
    this.storyText = value;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      const newPoker: Poker = {
        story: this.storyText,
        users: this.users,
        showVotes: this.displayPoints,
      };
      this.pokerService.updateRoom(newPoker);
    }, 1000);
  }

  getCardClasses(user: User): string {
    var classes = '';
    if (user.willNotVote) {
      classes = 'observer-card';
    } else {
      classes = user.hasVoted
        ? 'voter-cards voter-card-green'
        : 'voter-cards voter-card-red';
    }
    return classes;
  }

  removeUser(userName: string) {
    this.pokerService.removeUser(userName);
  }
}
