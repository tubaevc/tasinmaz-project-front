import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTasinmazComponent } from './add-tasinmaz/add-tasinmaz.component';
import {TasinmazList} from './tasinmaz-list/tasinmaz-list.component';
import { UpdateTasinmazComponent } from './update-tasinmaz/update-tasinmaz.component';
const routes: Routes = [
  {path:'tasinmaz',component:TasinmazList},
  {path:'add-tasinmaz',component:AddTasinmazComponent},
  { path: 'update-tasinmaz/:id', component: UpdateTasinmazComponent },
  {path:'',redirectTo:'tasinmaz',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
