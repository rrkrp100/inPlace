import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokerRoomComponent } from './poker-room.component';

describe('PokerRoomComponent', () => {
  let component: PokerRoomComponent;
  let fixture: ComponentFixture<PokerRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokerRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
