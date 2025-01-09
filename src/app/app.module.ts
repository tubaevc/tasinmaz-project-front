import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TasinmazList } from "src/app/tasinmaz-list/tasinmaz-list.component";
import { HttpClientModule } from "@angular/common/http";
import { AddTasinmazComponent } from "./add-tasinmaz/add-tasinmaz.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { UpdateTasinmazComponent } from "./update-tasinmaz/update-tasinmaz.component";
import { LoginComponent } from "./login/login.component";
import { AccountService } from "./services/account.service";
import { LoginGuard } from "./login/login.guard";
import { UserComponent } from "./user/user.component";
import { ExcelexportService } from "./services/excelexport.service";

@NgModule({
  declarations: [
    AppComponent,
    TasinmazList,
    AddTasinmazComponent,
    UpdateTasinmazComponent,
    LoginComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AccountService, LoginGuard, ExcelexportService],
  bootstrap: [AppComponent],
})
export class AppModule {}
