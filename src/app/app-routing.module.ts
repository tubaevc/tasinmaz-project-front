import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddTasinmazComponent } from "./add-tasinmaz/add-tasinmaz.component";
import { TasinmazList } from "./tasinmaz-list/tasinmaz-list.component";
import { UpdateTasinmazComponent } from "./update-tasinmaz/update-tasinmaz.component";
import { LoginComponent } from "./login/login.component";
import { LoginGuard } from "./login/login.guard";
const routes: Routes = [
  { path: "tasinmaz", component: TasinmazList, canActivate: [LoginGuard] },
  { path: "add-tasinmaz", component: AddTasinmazComponent },
  { path: "update-tasinmaz/:id", component: UpdateTasinmazComponent },
  { path: "", redirectTo: "tasinmaz", pathMatch: "full" },
  { path: "login", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
