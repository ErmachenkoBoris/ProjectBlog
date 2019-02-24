import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-main-page',
  templateUrl: './app-main-page.component.html',
  styleUrls: ['./app-main-page.component.less']
})
export class AppMainPageComponent implements OnInit {
  change_form_flag = 0;
  color_button: string[] = [
    '#d65fff',
    '#509dff'
  ];
  constructor() { }

  ngOnInit(): void {
  }

  Change_form(N: number): void {
    if (this.change_form_flag !== N) {
      this.change_form_flag = N;
      let tmp: string;
      tmp = this.color_button[0];
      this.color_button[0] = this.color_button[1];
      this.color_button[1] = tmp;
    }
  }

}
