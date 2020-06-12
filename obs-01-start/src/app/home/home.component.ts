import { Component, OnInit, OnDestroy } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { map, filter } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.firstObsSubscription = interval(1000)
      .pipe(
        filter((num) => num > 2),
        map((num) => `Round ${num + 1}`)
      )
      .subscribe((count) => {
        console.log(count);
      });
  }

  ngOnDestroy() {
    this.firstObsSubscription.unsubscribe();
  }
}
