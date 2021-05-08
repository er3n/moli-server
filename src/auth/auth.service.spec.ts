import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
        }),
      ],
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('when using local authentication if username and password correct validation should success', async () => {
    jest.spyOn(usersService, 'findOne').mockImplementation(async () => ({
      id: 1,
      username: 'john',
      password: 'password',
    }));
    const user = await service.validateUser('john', 'password');
    expect(!!user).toBeTruthy();
  });

  it('when using local authentication if username not exists validation should fail', async () => {
    jest
      .spyOn(usersService, 'findOne')
      .mockImplementation(async () => undefined);
    const user = await service.validateUser('john', 'password');
    expect(!!user).toBeFalsy();
  });

  it('when using local authentication if password wrong validation should fail', async () => {
    jest.spyOn(usersService, 'findOne').mockImplementation(async () => ({
      id: 1,
      username: 'john',
      password: 'password',
    }));
    const user = await service.validateUser('john', 'invalidpassword');
    expect(!!user).toBeFalsy();
  });
});
