import { HomeComponent } from './view/home/home.component';
import { Routes } from '@angular/router';
import { ListComponent } from './view/list/list.component';
import { MessagesComponent } from './view/messages/messages.component';
import { MemberListComponent } from './view/members/member-list/member-list.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { MemberDetailComponent } from './view/members/member-detail/member-detail.component';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { MemberEditComponent } from './view/members/member-edit/member-edit.component';
import { MemberEditResolver } from './resolvers/member-edit.resolver.ts';
import { PreventUnsavedChanges } from './guards/prevent-unsaved-changes.guard.ts';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthenticationGuard],
        children: [
            {path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
            {path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
            {path: 'member/edit', component: MemberEditComponent,
                resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges]},
            {path: 'messages', component: MessagesComponent},
            {path: 'lists', component: ListComponent}
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full'}
];
