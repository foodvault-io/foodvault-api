import { Injectable } from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { Example } from './entities/example.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly examples: Example[] = [];

  create(createExampleDto: CreateExampleDto) {
    this.examples.push(createExampleDto);
    return createExampleDto;
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findOne(id: number) {
    return this.examples[id];
  }
}
