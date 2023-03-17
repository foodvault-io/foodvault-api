import { Controller, Get, Post, Body, Param, Version } from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Example } from './entities/example.entity';

@ApiTags('Example')
@Controller({
  path: 'example',
  version: '1',
})
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Create Example' })
  async create(@Body() createExampleDto: CreateExampleDto): Promise<Example> {
    return this.exampleService.create(createExampleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Examples' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: Example,
  })
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Example by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Example,
  })
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }
}
