import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { ClashModule } from './clash/clash.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    SocketModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.local",
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      renderPath: '*', // Handles all routes (except API routes)
      serveRoot: '/', // Root for serving static files
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      }
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: configService.get('DB_SYNC'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: true
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MailModule,
    AuthModule,
    ClashModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
