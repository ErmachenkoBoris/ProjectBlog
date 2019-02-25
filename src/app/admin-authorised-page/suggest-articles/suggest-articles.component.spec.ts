import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestArticlesComponent } from './suggest-articles.component';

describe('SuggestArticlesComponent', () => {
  let component: SuggestArticlesComponent;
  let fixture: ComponentFixture<SuggestArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
