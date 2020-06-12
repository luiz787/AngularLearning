import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    h3 {
      color: grey;
    }
  `]
})
export class AppComponent {
  title = 'my-first-app';
}
