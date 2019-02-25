import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingArticleAdminComponent } from './reading-article-admin.component';

describe('ReadingArticleAdminComponent', () => {
  let component: ReadingArticleAdminComponent;
  let fixture: ComponentFixture<ReadingArticleAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadingArticleAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingArticleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
