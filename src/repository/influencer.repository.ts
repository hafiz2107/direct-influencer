import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Influencer } from '../schemas/influencer.schema';

@Injectable()
export class InfluencerRepository extends AbstractRepository<Influencer> {
  protected readonly logger = new Logger(InfluencerRepository.name);

  constructor(
    @InjectModel(Influencer.name) influencerModel: Model<Influencer>,
    @InjectConnection() connection: Connection,
  ) {
    super(influencerModel, connection);
  }
}
