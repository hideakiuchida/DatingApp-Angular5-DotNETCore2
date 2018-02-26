import { HomeComponent } from './view/home/home.component';
import { Routes } from '@angular/router';
import { ListComponent } from './view/list/list.component';
import { MessagesComponent } from './view/messages/messages.component';
import { MemberListComponent } from './view/member-list/member-list.component';
import { AuthenticationGuard } from './guards/authentication.guard';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthenticationGuard],
        children: [
            {path: 'members', component: MemberListComponent},
            {path: 'messages', component: MessagesComponent},
            {path: 'lists', component: ListComponent}
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full'}
];
