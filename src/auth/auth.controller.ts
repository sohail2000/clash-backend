import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, UsePipes, ValidationPipe, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { register } from 'module';
import { VerfiyEmailDto } from './dto/verify_email.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forget_password.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    return await this.authService.registerUser(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('check/login')
  async checkLogin(@Body() loginDto: LoginDto) {
    return this.authService.checkLogin(loginDto);
  }

  


  // @Get('verify/email')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async verifyEmail(@Query() query: VerfiyEmailDto) {
  //   const { email, token } = query;

  //   const isVerified = await this.authService.verifyEmail(email, token);

  //   if (!isVerified) {
  //     return {
  //       // url: "/verify/error"
  //       url: "https://developer.android.com/" 
  //       //TODO: create verify email error in front-end and then redirect to tjat
  //     }
  //   }
  //   return {
  //     // url: `${process.env.CLIENT_URL}/login`
  //     url: "https://flutter.dev/"
  //   }
  // }


  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    try {
      const message = await this.authService.forgetPassword(forgetPasswordDto);
      return message
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const message = await this.authService.resetPassword(resetPasswordDto);
      return message
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
