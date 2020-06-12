import { Component, OnInit } from "@angular/core";

import { ServersService } from "../servers.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { CanComponentDeactivate } from "./can-deactivate-guard.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-edit-server",
  templateUrl: "./edit-server.component.html",
  styleUrls: ["./edit-server.component.css"],
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: { id: number; name: string; status: string };
  serverName = "";
  serverStatus = "";
  allowEdit = false;
  changesSaved = false;

  constructor(
    private serversService: ServersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      const allowEdit = params["allowEdit"];
      this.allowEdit = allowEdit === "1";
    });
    this.route.params.subscribe((params: Params) => {
      const id = parseInt(params["id"]);
      this.server = this.serversService.getServer(id);
      this.serverName = this.server.name;
      this.serverStatus = this.server.status;
    });
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {
      name: this.serverName,
      status: this.serverStatus,
    });
    this.changesSaved = true;
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return true;
    }
    const someDataChanged =
      this.serverName !== this.server.name ||
      this.serverStatus !== this.server.status;

    if (someDataChanged && !this.changesSaved) {
      return confirm("Do you want to discard the changes?");
    } else {
      return true;
    }
  }
}
