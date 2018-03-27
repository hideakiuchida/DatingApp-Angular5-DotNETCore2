import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { User } from '../../models/User';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthenticationService {
    baseUrl = 'http://localhost:5000/api/authentication/';
    userToken: any;
    decodedToken: any;
    currentUser: User;
    jwtHelper: JwtHelper = new JwtHelper();
    private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
    currentPhotoUrl = this.photoUrl.asObservable();

    constructor(private http: Http) { }

    changeMemberPhoto(photoUrl: string) {
        photoUrl = photoUrl !== null ? photoUrl : '../../assets/user.png';
        this.photoUrl.next(photoUrl);
    }

    login(model: any) {
        return this.http.post(this.baseUrl + 'login', model, this.requestOptions())
        .map((response: Response) => {
            const data = response.json();
            if (data && data.tokenString) {
                localStorage.setItem('token', data.tokenString);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.decodedToken = this.jwtHelper.decodeToken(data.tokenString);
                this.currentUser = data.user;
                this.userToken = data.tokenString;
                this.changeMemberPhoto(this.currentUser.photoUrl);
            }
        }).catch(this.handleError);
    }

    register(user: User) {
        return this.http.post(this.baseUrl + 'register', user, this.requestOptions()).catch(this.handleError);
    }

    loggedIn() {
        return tokenNotExpired('token');
    }

    private requestOptions() {
        const headers = new Headers({'Content-type': 'application/json'});
        return new RequestOptions({headers: headers});
    }

    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return Observable.throw(applicationError);
        }
        const serverError = error.json();
        let modelStateErrors = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }
        return Observable.throw(modelStateErrors || 'Server error');
    }
}
