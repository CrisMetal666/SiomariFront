import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import * as decode from 'jwt-decode';
import { TOKEN_NAME } from './var.const';

@Injectable()
export class GuardService {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    

    if (sessionStorage.getItem(TOKEN_NAME) == null) {
      sessionStorage.clear();
      this.router.navigate(['login']);
      return false;
    }

    let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));

    if (tokenNotExpired(TOKEN_NAME, token.access_token)) {

      return true;

    } else {

      sessionStorage.clear();
      this.router.navigate(['login']);
      return false;
    }

  }
}
