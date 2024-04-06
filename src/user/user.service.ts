import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  getUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
