import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasinmazList } from 'src/app/tasinmaz-list/tasinmaz-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AddTasinmazComponent } from './add-tasinmaz/add-tasinmaz.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TasinmazList,
    AddTasinmazComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
