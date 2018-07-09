import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../_service/login.service';
import { TOKEN_NAME } from '../../_service/var.const';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // credenciales del usuario
  identificacion: string;
  clave: string;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  iniciarSesion() {
    this.loginService.login(this.identificacion, this.clave).subscribe(data => {

      if (data) {
        let token = JSON.stringify(data);
        sessionStorage.setItem(TOKEN_NAME, token);
        this.router.navigate(['distribucion-agua-mensual']);
      }
    });
  }

}
