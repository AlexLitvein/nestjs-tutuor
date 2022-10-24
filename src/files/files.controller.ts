import {
  Post,
  Controller,
  UploadedFiles,
  UploadedFile,
  Logger,
  UseInterceptors,
  UseGuards,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiMultiFile } from './apimultifile';
import { ApiException } from './api-exception.model';
import { FilesService } from './files.service';
import { FileResponseVm } from './dto/file-response-vm.dto';
import { UploadFileResponse, UploadFile } from './dto/fileUpload.dto';

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(private filesService: FilesService) { }

  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return file;
  }

  @ApiOperation({
    description:
      'Загрузить файлы на сервер. Пользоваться этим запросом (даже для одного файла).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @ApiResponse({
    status: 201,
    type: [UploadFileResponse],
  })
  @UseInterceptors(FilesInterceptor('files'))
  @Post('many')
  uploadMany(@UploadedFiles() files: UploadFile[]) {
    // files: Array<Express.Multer.File>,
    console.log('uploadMany: ');
    console.log({
      files_log: files,
    });

    // return files.map((file) => ({
    //   id: file.id,
    //   originalname: file.originalname,
    //   uploadDate: file.uploadDate,
    // }));
    return null;
  }

  // @Get('info/:id')
  // @ApiBadRequestResponse({ type: ApiException })
  // async getFileInfo(@Param('id') id: string): Promise<FileResponseVm> {
  //   const file = await this.filesService.findInfo(id);
  //   const filestream = await this.filesService.readStream(id);
  //   if (!filestream) {
  //     throw new HttpException(
  //       'An error occurred while retrieving file info',
  //       HttpStatus.EXPECTATION_FAILED,
  //     );
  //   }
  //   return {
  //     message: 'File has been detected',
  //     file: file,
  //   };
  // }

  // @Get(':id')
  // @ApiBadRequestResponse({ type: ApiException })
  // async getFile(@Param('id') id: string, @Res() res) {
  //   const file = await this.filesService.findInfo(id);
  //   const filestream = await this.filesService.readStream(id);
  //   if (!filestream) {
  //     throw new HttpException(
  //       'An error occurred while retrieving file',
  //       HttpStatus.EXPECTATION_FAILED,
  //     );
  //   }
  //   res.header('Content-Type', file.contentType);
  //   return filestream.pipe(res);
  // }

  @Delete('delete/:id')
  @ApiBadRequestResponse({ type: ApiException })
  @ApiCreatedResponse({ type: FileResponseVm })
  async deleteFile(@Param('id') id: string): Promise<FileResponseVm> {
    const file = await this.filesService.findInfo(id);
    // console.log('file определён');
    const filestream = await this.filesService.deleteFile(id);
    // console.log('filestream определён', filestream);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: file,
    };
  }
}
