import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      projectName: new FormControl(
        null,
        [Validators.required],
        this.asyncCustomProjectNameValidator.bind(this)
      ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      projectStatus: new FormControl(null),
    });

    this.form.statusChanges.subscribe((status) => {
      console.log(status);
    });
  }

  onSubmit() {
    console.log(this.form);
  }

  private syncCustomProjectNameValidator(
    control: FormControl
  ): { [key: string]: boolean } {
    if ("Test" === control.value) {
      return {
        invalidProjectName: true,
      };
    }
    return null;
  }

  private asyncCustomProjectNameValidator(
    control: FormControl
  ): Promise<any> | Observable<any> {
    return new Promise((resolve, _) => {
      setTimeout(() => {
        console.log("Checking if name is invalid, async");
        if ("Test" === control.value) {
          return resolve({
            invalidProjectName: true,
          });
        }
        return resolve(null);
      }, 1000);
    });
  }
}
