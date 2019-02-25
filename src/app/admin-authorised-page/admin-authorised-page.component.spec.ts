import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuthorisedPageComponent } from './admin-authorised-page.component';

describe('AdminAuthorisedPageComponent', () => {
  let component: AdminAuthorisedPageComponent;
  let fixture: ComponentFixture<AdminAuthorisedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAuthorisedPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAuthorisedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
