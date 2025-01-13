import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

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
  submitted = false;
  alertMessage = "";
  showAlert = false;
  alertType = "";
  showDeleteModal: boolean = false;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  selectedCount: number = 0;
  showUpdateErrorModal: boolean = false;
  errorMessage: string = "";
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
  get f() {
    return this.addUserForm.controls;
  }

  showNotification(message: string, type: "success" | "danger") {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.showAlert = false;
      if (type === "success") {
        this.closePopup();
      }
    }, 3000);
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
    this.submitted = false;
    this.addUserForm.reset();
    this.selectedUserId = null;
    document.getElementById("popup")!.style.display = "none";
  }
  saveUser(): void {
    this.submitted = true;
    console.log("saveUser method called", this.addUserForm.value);

    if (this.addUserForm.invalid) {
      // Form geçersizse işlem yapma
      return;
    }

    const userToSave = { ...this.addUserForm.value };

    if (this.action === "add") {
      this.userService.addUser(userToSave).subscribe(
        () => {
          this.showNotification("User added successfully!", "success");
          this.loadUsers();
          this.closePopup();
        },
        (error) => {
          if (error.status === 500) {
            // 500 - Internal Server Error
            this.showNotification("Kullanıcı zaten kayıtlı!", "danger");
          } else {
            // Diğer hatalar
            this.showNotification("Error adding user!", "danger");
          }
        }
      );
    } else if (this.action === "edit" && this.selectedUserId) {
      if (!userToSave.password) {
        delete userToSave.password;
      }

      this.userService.updateUser(this.selectedUserId, userToSave).subscribe(
        () => {
          this.showNotification("User updated successfully!", "success");
          this.loadUsers();
          this.closePopup();
        },
        (error) => {
          if (error.status === 400) {
            this.showNotification("Invalid data provided!", "danger");
          } else if (error.status === 500) {
            this.showNotification(
              "A server error occurred. Please try again.",
              "danger"
            );
          } else {
            this.showNotification("Error updating user!", "danger");
          }
        }
      );
    }
  }

  deleteUser(id: number): void {
    this.selectedUserId = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.selectedUserId) return;

    this.userService.deleteUser(this.selectedUserId).subscribe({
      next: () => {
        this.showNotification("User deleted successfully!", "success");
        this.loadUsers();
        this.closeModals();
      },
      error: (err) => {
        console.error("Error deleting user:", err);
        this.showNotification("Error deleting user!", "danger");
        this.closeModals();
      },
    });
  }

  closeModals(): void {
    this.showDeleteModal = false;
    this.selectedUserId = null;
  }

  onSelectUser(user: any): void {
    console.log("Selected User:", user);
    this.selectedUserId = user.userId;
  }
  isLoggedIn() {
    return this.authService.loggedIn();
  }
  logOut() {
    this.authService.logOut();
    this.router.navigate(["login"]);
  }
}
