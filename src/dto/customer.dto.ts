import { IsEmail, IsString } from 'class-validator';

export class CustomerDto {
  @IsString()
  readonly fullname: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly address: string;

  readonly string: number;
}
