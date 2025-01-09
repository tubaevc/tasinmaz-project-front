import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  users: any[] = [];
  selectedUserId: number | null = null;
  action: string = "";
  addUserForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.addUserForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
      role: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  openPopup(action: string): void {
    this.action = action;
    if (action === "add") {
      this.addUserForm.reset({ email: "", password: "", role: "" });
    } else if (action === "edit" && this.selectedUserId) {
      const selectedUser = this.users.find(
        (user) => user.userId === this.selectedUserId
      );
      if (selectedUser) {
        this.addUserForm.patchValue({
          email: selectedUser.userEmail,
          role: selectedUser.role,
        });
      }
    }
    document.getElementById("popup")!.style.display = "block";
  }

  closePopup(): void {
    this.addUserForm.reset();
    this.selectedUserId = null;
    document.getElementById("popup")!.style.display = "none";
  }
  saveUser(): void {
    console.log("saveUser method called", this.addUserForm.value);

    if (this.addUserForm.invalid) {
      alert("Please fill the form correctly.");
      return;
    }
    const userToSave = { ...this.addUserForm.value };
    if (this.action === "add") {
      this.userService.addUser(userToSave).subscribe(() => {
        alert("User added successfully!");
        this.loadUsers();
        this.closePopup();
      });
    } else if (this.action === "edit" && this.selectedUserId) {
      if (!userToSave.password) {
        delete userToSave.password;
      }

      this.userService
        .updateUser(this.selectedUserId, userToSave)
        .subscribe(() => {
          alert("User updated successfully!");
          this.loadUsers();
          this.closePopup();
        });
    }
  }

  deleteUser(id: number): void {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userService.deleteUser(id).subscribe(() => {
        alert("User deleted successfully!");
        this.loadUsers();
      });
    }
  }

  onSelectUser(user: any): void {
    console.log("Selected User:", user);
    this.selectedUserId = user.userId;
  }
}
