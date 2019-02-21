import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthorizedPageComponent } from './user-authorized-page.component';

describe('UserAuthorizedPageComponent', () => {
  let component: UserAuthorizedPageComponent;
  let fixture: ComponentFixture<UserAuthorizedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAuthorizedPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuthorizedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
