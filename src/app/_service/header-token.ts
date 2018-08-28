import { HttpHeaders } from '@angular/common/http';
import { TOKEN_NAME } from './var.const';

export class HeaderToken {

    /**
     * se creara el header que llevara el token de autorizacion, se envia y recibe en formato json
     */
    getHeader() {

        let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;

        return {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
                .set('Content-Type', 'application/json')
        };

    }

    /**
     * se creara el header para enviar archivos al servidor
     */
    getHeaderSendFile() {

        let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;

        return {
            headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        };
    }

    /**
     * retorna un objeto de tipo HttpHeaders con el token
     */
    header() {
        let access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
        return new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json');
    }

    getToken() {

        let objectToken = sessionStorage.getItem(TOKEN_NAME);

        // nos aseguramos que exista un token antes de tratar de acceder a el
        if(objectToken == null) {

            return "";

        } else {

            return JSON.parse(objectToken).access_token;
        }
    }


}