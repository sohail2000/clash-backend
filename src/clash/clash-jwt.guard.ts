import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const user = await this.jwtService.verifyAsync(token, {
        // TODO:use config service.
        // secret: "bhvbehbf_hhkh((*&*kjjkkef"
        secret: this.configService.get('JWT_SECRET')
      });
      console.log("user in jwt Guard", user);
      request.user = user;
      console.log("user in request.user", request.user);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
