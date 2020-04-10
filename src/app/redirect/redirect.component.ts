import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent implements OnInit {
  constructor(router: Router) {
    const newUrl = router.url.substr(9);
    router.navigateByUrl(newUrl);
  }

  ngOnInit(): void {}
}
