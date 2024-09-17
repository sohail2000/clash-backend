import { IsEmail, IsNotEmpty, MinLength, ValidateIf, ValidationArguments } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, {
    message: (args: ValidationArguments) => `${args.property}: Please enter a correct email`,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => `${args.property}: Email is required.`,
  })
  email: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => `${args.property}: Please make sure you are using the correct URL.`,
  })
  token: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => `${args.property}: Password is required`,
  })
  @MinLength(6, {
    message: (args: ValidationArguments) => `${args.property}: Password must be at least 6 characters long`,
  })
  password: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => `${args.property}: Confirm Password is required`,
  })
  @ValidateIf((o) => o.password === o.confirm_password, {
    message: (args: ValidationArguments) => `${args.property}: Confirm password does not match`,
  })
  confirm_password: string;
}
