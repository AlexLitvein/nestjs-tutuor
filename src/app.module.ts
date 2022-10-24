import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'auth/auth.module';
import { UserModule } from 'user/user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from 'project/project.module';
import { DocumentModule } from 'document/document.module';
import { ChatModule } from './chat/chat.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express/multer';
import { GridFsMulterConfigService } from 'files/multer-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      dbName: 'nest',
      connectionName: 'nest',
    }),
    MongooseModule.forRoot(process.env.DATABASE_FILE_URL, {
      dbName: 'files',
      connectionName: 'files',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProjectModule,
    DocumentModule,
    ChatModule,
    FilesModule,
  ],
})
export class AppModule {}
