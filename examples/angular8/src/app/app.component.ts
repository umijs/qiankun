import { Component } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app1';

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {
    this.router.events.subscribe((event: Event) => {
      // onSameUrlNavigation: 'reload',相同的url，每次都会重新触发路由上的events事件循环
      if (event instanceof NavigationEnd) {
        console.log(event);
      }
    });
  }
}
