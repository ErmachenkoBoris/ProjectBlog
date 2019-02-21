import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizationFormComponent } from './autorization-form.component';

describe('AutorizationFormComponent', () => {
  let component: AutorizationFormComponent;
  let fixture: ComponentFixture<AutorizationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorizationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
