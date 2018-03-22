import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';

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
import { AuthModule } from './view/auth/auth.module';
import { MemberDetailComponent } from './view/members/member-detail/member-detail.component';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { MemberEditComponent } from './view/members/member-edit/member-edit.component';
import { MemberEditResolver } from './resolvers/member-edit.resolver.ts';
import { PreventUnsavedChanges } from './guards/prevent-unsaved-changes.guard.ts';
import { PhotoEditorComponent } from './view/members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent
],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    AuthModule,
    TabsModule.forRoot(),
    NgxGalleryModule,
    FileUploadModule
  ],
  providers: [
    AuthenticationService,
    AlertifyService,
    AuthenticationGuard,
    UserService,
    MemberDetailResolver,
    MemberListResolver,
    MemberEditResolver,
    PreventUnsavedChanges
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
