import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.shema';
import { StorageService } from 'storage/storage.service';
// import { StorageModule } from 'storage/storage.module';

@Module({
  /**
   * MongooseModule предоставляет метод forFeature() для настройки модуля, включая
   * определение того, какие модели должны быть зарегистрированы в текущей области.
   * Если вы также хотите использовать модели в другом модуле, добавьте MongooseModule
   * в exports раздел CatsModule и импортируйте CatsModule в другой модуль.
   */
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'nest',
    ),
    // StorageModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  // exports: [UserService],
})
export class UserModule {}
