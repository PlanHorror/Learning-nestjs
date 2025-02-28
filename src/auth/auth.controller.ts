import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth.credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() newUser: AuthCredentialDto): Promise<void> {
    return await this.authService.signUp(newUser);
  }

  @Post('/signin')
  async signIn(
    @Body() thisUser: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(thisUser);
  }

  @Get('test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
