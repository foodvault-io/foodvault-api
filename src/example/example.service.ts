import { Injectable } from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { Example } from './entities/example.entity';

@Injectable()
export class ExampleService {
  private readonly examples: Example[] = [];

  create(createExampleDto: CreateExampleDto) {
    this.examples.push(createExampleDto);
    return createExampleDto;
  }

  findAll() {
    return this.examples;
  }

  findOne(id: number) {
    return this.examples[id];
  }
}
