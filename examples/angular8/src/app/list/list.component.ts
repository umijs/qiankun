import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  templateUrl: './list.component.html',
})
export class ListComponent {
  timestamp: any;

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {
    console.log('ListComponent constructor', Date.now());
    this.activatedRoute.params.subscribe((params: Params) => {
      // 从url中获取参数
      this.timestamp = params.timestamp;
    });
  }

  reload() {
    this.router.navigate([this.router.url.split(';')[0].split('?')[0], { timestamp: Date.now() }], {
      replaceUrl: true,
    });
  }
}
