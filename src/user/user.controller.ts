import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiProperty,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { GetUser } from 'auth/decorator';
import { JwtGuard } from 'auth/guard';
import { ApiErrorDto } from 'error/dto/apiError.dto';
import { ApiException } from 'files/api-exception.model';
import { FilesService } from 'files/files.service';
import { ObjectId } from 'mongoose';
import { AvatarDto, EditUserDto, UserDto } from 'user/dto';
import { UserService } from 'user/user.service';

@ApiTags('Пользователи')
@ApiBearerAuth('defaultBearerAuth')
@ApiResponse({
  status: 400,
  description: 'Error description string',
  type: ApiErrorDto,
})
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private filesService: FilesService,
  ) {}

  // ======== readOne ==========
  @ApiOperation({
    description: 'Получить пользователя по его id',
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiParam({
    name: 'id',
    description: 'id пользователя',
  })
  @Get(':id')
  readOne(@Param('id') id: ObjectId) {
    return this.userService.findOne(id);
  }

  // ======== readMany ==========
  @ApiOperation({
    description: 'Получить всех пользователей',
  })
  @ApiResponse({
    status: 200,
    type: [UserDto],
  })
  @Get()
  readMany() {
    return this.userService.findAll();
  }

  // ======== update ==========
  @ApiOperation({
    description: 'Обновить данные юзера',
  })
  @ApiBody({
    type: EditUserDto,
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @Patch('update')
  update(@GetUser('_id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  // ======== set avatar ==========
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Загрузка аватара',
    type: AvatarDto,
  })
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  setAvatar(@GetUser('_id') userId: string, @UploadedFile() file) {
    return this.userService.setUserAvatar(userId, file.id);
  }

  // ======== get avatar ==========
  @ApiOperation({
    description: 'Получить аватар пользователя по id пользователя',
  })
  // @ApiResponse({
  //   status: 200,
  //   type: UserDto,
  // })
  @ApiParam({
    name: 'id',
    description: 'id пользователя',
  })
  @Get(':id/avatar')
  @ApiBadRequestResponse({ type: ApiException })
  async getAvatar(@Param('id') id: ObjectId, @Res() res) {
    const user = await this.userService.findOne(id);
    if (user.avatar) {
      const file = await this.filesService.findInfo(user.avatar);
      const filestream = await this.filesService.readStream(user.avatar);
      if (!filestream) {
        throw new HttpException(
          'An error occurred while retrieving file',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      res.header('Content-Type', file.contentType);
      return filestream.pipe(res);
    } else {
    }
  }
}
