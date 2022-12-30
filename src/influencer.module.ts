import { DatabaseModule, FirebaseAuthStrategy, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { InfluencerController } from './influencer.controller';
import { InfluencerRepository } from './repository/influencer.repository';
import { InfluencerService } from './influencer.service';
import { Influencer, InfluencerSchema } from './schemas/influencer.schema';
import { MEETING_SERVICE } from './constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        REDIS_CLIENT: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        SESSION_SECRET: Joi.string().required(),
      }),
      envFilePath: './apps/influencer/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Influencer.name, schema: InfluencerSchema },
    ]),
    RmqModule.register({
      name: MEETING_SERVICE,
    }),
  ],
  controllers: [InfluencerController],
  providers: [InfluencerService, InfluencerRepository, FirebaseAuthStrategy],
})
export class InfluencerModule {}
