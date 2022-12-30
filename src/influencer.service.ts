import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MEETING_SERVICE } from './constants/services';
import { CreateInfluencerRequest } from './dto/create-influencer.dto';
import { InfluencerRepository } from './repository/influencer.repository';

@Injectable()
export class InfluencerService {
  constructor(
    private readonly influencerRepository: InfluencerRepository,
    @Inject(MEETING_SERVICE) private meetingClient: ClientProxy,
  ) {}

  async createInfluencer(request: CreateInfluencerRequest) {
    // const session = await this.influencerRepository.startTransaction();
    try {
      const influencer = await this.influencerRepository.create(request);

      await this.meetingClient.emit('influencer_created', {
        request,
      }),
        console.log('Transaction Result -> ', influencer);

      return influencer;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  async getUpcomingMeetings(skip, take, influencerId) {
    try {
      const res = await lastValueFrom(
        this.meetingClient.send('get_upcoming_meetings', {
          skip,
          take,
          influencerId,
        }),
      ).catch((err) => {
        throw new Error(err);
      });

      return res;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  }

  async getPendingRequestsCount(influencer_id) {
    try {
      const result = await lastValueFrom(
        this.meetingClient.send('get_pending_request_count', {
          influencer_id,
        }),
      ).catch((err) => {
        throw new Error(err);
      });

      return result;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  }

  async acceptPendingRequest(
    influencer_id,
    meetingId,
    status,
    skip,
    take,
    sortKey,
    sortDirection,
  ) {
    try {
      const result = await lastValueFrom(
        this.meetingClient.send('accept_pending_request', {
          influencer_id,
          meetingId,
          status,
          skip,
          take,
          sortKey,
          sortDirection,
        }),
      ).catch((err) => {
        throw new Error(err);
      });
      return result;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  }

  async getScheduledMeetings(
    influencerId,
    date,
    meetingType,
    skip,
    take,
    sortKey,
    sortDirection,
  ) {
    try {
      const result = lastValueFrom(
        await this.meetingClient.send('get-scheduled-meetings', {
          influencerId,
          date,
          meetingType,
          skip,
          take,
          sortKey,
          sortDirection,
        }),
      );
      return result;
    } catch (err) {}
  }

  async getPendingRequests(influencerId, skip, take, sortKey, sortDirection) {
    try {
      const pendingRequests = await lastValueFrom(
        this.meetingClient.send('get-pending-request', {
          influencerId,
          skip,
          take,
          sortKey,
          sortDirection,
        }),
      );
      return pendingRequests;
    } catch (err) {
      throw new Error(err);
    }
  }
}
