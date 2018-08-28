import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { TOKEN_NAME, ROLE_JEFE_DISTRITO } from './var.const';
import * as decode from 'jwt-decode';

@Injectable()
export class GuardJefeDistritoGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    if (sessionStorage.getItem(TOKEN_NAME) == null) {
      sessionStorage.clear();
      this.router.navigate(['login']);
      return false;
    }

    let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));

    if (tokenNotExpired(TOKEN_NAME, token.access_token)) {

      let credenciales = decode(token.access_token);

      let role = credenciales.authorities[0];

      if(role == ROLE_JEFE_DISTRITO) {

        return true;
        
      } else {

        this.router.navigate(['inicio']);
        return false;
      }

    } else {

      sessionStorage.clear();
      this.router.navigate(['login']);

      return false;
    }

  }
}
