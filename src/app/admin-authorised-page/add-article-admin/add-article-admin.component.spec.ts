import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticleAdminComponent } from './add-article-admin.component';

describe('AddArticleAdminComponent', () => {
  let component: AddArticleAdminComponent;
  let fixture: ComponentFixture<AddArticleAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddArticleAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArticleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
