import { Module } from '@nestjs/common';
import { ClashService } from './clash.service';
import { ClashController } from './clash.controller';
import { MulterModule } from '@nestjs/platform-express/multer';
import { Clash } from './entities/clash.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClashItem } from './entities/clash_item.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clash, ClashItem, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [ClashController],
  providers: [ClashService],
  exports: [TypeOrmModule]
})
export class ClashModule { }
