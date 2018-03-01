import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { NavComponent } from './view/nav/nav.component';
import { AuthenticationService } from './services/authentication/authentication.service';
import { HomeComponent } from './view/home/home.component';
import { RegisterComponent } from './view/register/register.component';
import { AlertifyService } from './services/alertify/alertify.service';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { MemberListComponent } from './view/members/member-list/member-list.component';
import { ListComponent } from './view/list/list.component';
import { MessagesComponent } from './view/messages/messages.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { UserService } from './services/user/user.service';
import { MemberCardComponent } from './view/members/member-card/member-card.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListComponent,
    MessagesComponent,
    MemberCardComponent
],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthenticationService,
    AlertifyService,
    AuthenticationGuard,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
