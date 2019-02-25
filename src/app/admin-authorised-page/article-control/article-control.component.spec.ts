import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleControlComponent } from './article-control.component';

describe('ArticleControlComponent', () => {
  let component: ArticleControlComponent;
  let fixture: ComponentFixture<ArticleControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
