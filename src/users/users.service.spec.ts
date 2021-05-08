import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not found user when not exists', async () => {
    const undefinedUser = await service.findOne('invalid user');
    expect(undefinedUser).toBeUndefined();
  });

  it('should return user when searcher', async () => {
    const existingUser = service.findOne('john');
    expect(existingUser).toBeDefined();
  });
});
