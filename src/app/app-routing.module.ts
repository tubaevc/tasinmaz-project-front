import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddTasinmazComponent } from "./add-tasinmaz/add-tasinmaz.component";
import { TasinmazList } from "./tasinmaz-list/tasinmaz-list.component";
import { UpdateTasinmazComponent } from "./update-tasinmaz/update-tasinmaz.component";
import { LoginComponent } from "./login/login.component";
import { LoginGuard } from "./login/login.guard";
import { UserComponent } from "./user/user.component";
import { AdminGuard } from "./login/admin.guard";
const routes: Routes = [
  { path: "tasinmaz", component: TasinmazList, canActivate: [LoginGuard] },
  {
    path: "add-tasinmaz",
    component: AddTasinmazComponent,
    canActivate: [LoginGuard],
  },
  {
    path: "update-tasinmaz/:id",
    component: UpdateTasinmazComponent,
    canActivate: [LoginGuard],
  },
  { path: "", redirectTo: "tasinmaz", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "users",
    component: UserComponent,
    canActivate: [LoginGuard, AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
