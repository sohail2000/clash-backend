import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, Length, MaxLength, IsDateString, ValidationArguments } from 'class-validator';

export class CreateClashDto {
    @IsString({
        message: (args: ValidationArguments) => `${args.property}: Title is required`,
    })
    @Length(2, 60, {
        message: (args: ValidationArguments) => `${args.property}: Length must be between 2 and 60 characters`,
    })
    title: string;

    @IsOptional()
    @IsString({
        message: (args: ValidationArguments) => `${args.property}: Description must be a string`,
    })
    @MaxLength(500, {
        message: (args: ValidationArguments) => `${args.property}: Description length must be below 500 characters`,
    })
    description?: string;

    @IsDate({
        message: (args: ValidationArguments) => `${args.property}: Please enter a valid date`,
    }) 
    @Type(() => Date) 
    expire_at: Date;

    @IsOptional()
    @IsString({
        message: (args: ValidationArguments) => `${args.property}: Image must be a string`,
    })
    image?: string; 
}
