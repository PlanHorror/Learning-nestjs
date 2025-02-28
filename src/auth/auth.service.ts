import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth.credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(user: AuthCredentialDto): Promise<void> {
    // const newUser = this.usersRepository.create(user);
    const { username, password } = user;
    const salt: string = (await bcrypt.genSalt()) as string;
    const newUser = this.usersRepository.create({
      username: username,
      password: (await bcrypt.hash(password, salt)) as string,
    });
    try {
      await this.usersRepository.save(newUser);
    } catch (error) {
      throw error.code == '23505'
        ? new ConflictException('Username duplicate')
        : new InternalServerErrorException();
    }
  }

  async signIn(user: AuthCredentialDto): Promise<{ accessToken: string }> {
    const { username, password } = user;
    const thisUser = await this.usersRepository.findOneBy({
      username: username,
    });
    if (!thisUser) {
      throw new NotFoundException();
    } else {
      const compare: boolean = (await bcrypt.compare(
        password,
        thisUser.password,
      )) as boolean;
      if (compare) {
        const payload: JwtPayload = { username };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
