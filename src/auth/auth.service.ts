import { ConflictException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import { VerfiyEmailDto } from './dto/verify_email.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ForgetPasswordDto } from './dto/forget_password.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async registerUser(registerDto: RegisterDto): Promise<User> {

    // check email already used 
    const user = await this.userRepo.findOne({ where: { email: registerDto.email } });
    console.log("user", user);
    if (user) {
      throw new ConflictException('User with same email already exist');
    }

    // hash password -
    const salt = await bcrypt.genSalt(10);
    registerDto.password = await bcrypt.hash(registerDto.password, salt);

    // send verfication email
    // **TODO** //

    const newUser = this.userRepo.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
    })

    //**TODO:  by pass email verification */
    newUser.email_verified_at = new Date();
    //
    return this.userRepo.save(newUser);
  }

  async verifyEmail(email: string, token: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['email_verify_token', 'id'],
    });

    if (!user) {
      return false;
    }

    // Check if the token matches
    if (token !== user.email_verify_token) {
      return false;
    }

    // Update the user with verified details
    user.email_verified_at = new Date();
    user.email_verify_token = null;
    await this.userRepo.save(user);

    return true;
  }

  async login(loginDto: LoginDto) {
    // * Check if user exists
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new NotFoundException('No user found with this email.');
    }

    // * Check if email is verified
    if (user.email_verified_at === null) {
      throw new UnprocessableEntityException({
        email: 'Email is not verified yet. Please check your email and verify it.',
      });
    }

    // * Check password
    const compare = await bcrypt.compare(loginDto.password, user.password);
    if (!compare) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRESIN'),
    });

    const resPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      token: `Bearer ${token}`,
    };

    return {
      message: 'Logged in successfully!',
      data: resPayload,
    };
  }

  async checkLogin(loginDto: LoginDto) {
    // * Check if user exists
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new NotFoundException('No user found with this email.');
    }

    // * Check if email is verified
    if (user.email_verified_at === null) {
      throw new UnprocessableEntityException({
        email: 'Email is not verified yet. Please check your email and verify it.',
      });
    }

    // * Check password
    const compare = await bcrypt.compare(loginDto.password, user.password);
    if (!compare) {
      throw new UnauthorizedException('Invalid credentials.');
    }


    return {
      message: 'Logged in successfully!',
      data: null,
    };
  }

  // Forget-Password

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<string> {
    const { email } = forgetPasswordDto;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new Error('No Account found with this email!');
    }

    const id = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const token = await bcrypt.hash(id, salt);

    await this.userRepo.update(
      { email },
      { password_reset_token: token, token_send_at: new Date() },
    );

    const url = `${process.env.CLIENT_URL}/reset-password?email=${email}&token=${token}`;

    //TODO: Send email via a queue (BullMQ)
    // await this.emailQueueService.sendEmail({
    //   to: email,
    //   subject: 'Forgot Password',
    //   html: `<p>Hello, please reset your password using the following link: <a href="${url}">${url}</a></p>`,
    // });

    return 'Email sent successfully! Please check your email.';
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, token, password } = resetPasswordDto;

    const user = await this.userRepo.findOne({
      where: { email },
      select: ['password_reset_token', 'token_send_at'],
    });

    if (!user) {
      throw new Error('No Account found with this email.');
    }

    // Validate the token
    const isTokenValid = await bcrypt.compare(token, user.password_reset_token);
    if (!isTokenValid) {
      throw new Error('Invalid token, please use the correct URL.');
    }

    const hoursDiff = Math.abs(new Date().getTime() - new Date(user.token_send_at).getTime()) / 36e5;
    if (hoursDiff > 2) {
      throw new Error('Token has expired, please request a new one.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepo.update(
      { email },
      { password: hashedPassword, password_reset_token: null, token_send_at: null },
    );

    return 'Password reset successfully! Please try logging in.';
  }

}
