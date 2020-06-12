import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "./user.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  userActivated = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscription = this.userService.activatedEmitter.subscribe(
      (didActivate) => {
        this.userActivated = didActivate;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
