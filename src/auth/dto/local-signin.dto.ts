import { PartialType } from '@nestjs/swagger';
import { LocalAuthDto } from './local-auth.dto';

export class LocalSignInDto extends PartialType(LocalAuthDto) { }