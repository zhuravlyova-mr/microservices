import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtIfAdmin implements CanActivate {
    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;
      
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
             
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Некорректный токен для авторизации'})
            }
            const user = this.jwtService.verify(token);
            req.user = user;
            if ( user.roles.find(role => role.value === 'Admin') ) { //разрешить удаление админу
                return true;
            }
            else {
                return false;
            }
        } catch (e) {
            throw new UnauthorizedException({message: 'Недостаточно прав для выполнения операции: доступно администратору'});
        }
    }

}

