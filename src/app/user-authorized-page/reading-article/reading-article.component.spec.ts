import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingArticleComponent } from './reading-article.component';

describe('ReadingArticleComponent', () => {
  let component: ReadingArticleComponent;
  let fixture: ComponentFixture<ReadingArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadingArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
