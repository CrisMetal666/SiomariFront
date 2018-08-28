import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { TOKEN_NAME } from './var.const';

/*
* guard general para componentes que es indiferente el tipo de rol que se tenga
*/
@Injectable()
export class GuardService {

  constructor(private router: Router) {
  }

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
