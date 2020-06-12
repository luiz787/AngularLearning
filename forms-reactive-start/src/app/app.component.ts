import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  Validator,
} from "@angular/forms";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  genders = ["male", "female"];
  signupForm: FormGroup;
  forbiddenUsernames = ["Chris", "Anna"];

  ngOnInit() {
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          this.forbiddenUsernameValidator.bind(this),
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          this.forbiddenEmails.bind(this)
        ),
      }),
      gender: new FormControl("male"),
      hobbies: new FormArray([]),
    });
    this.signupForm.statusChanges.subscribe((status) => {
      console.log(status);
    });
  }

  get controls() {
    return (this.signupForm.get("hobbies") as FormArray).controls;
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get("hobbies")).push(control);
  }

  private forbiddenUsernameValidator(
    control: FormControl
  ): { [key: string]: boolean } {
    if (this.forbiddenUsernames.includes(control.value)) {
      return {
        nameIsForbidden: true,
      };
    }
    return null;
  }

  private forbiddenEmails(
    control: FormControl
  ): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === "test@test.com") {
          resolve({
            emailIsForbidden: true,
          });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
