import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateInfluencerRequest } from './dto/create-influencer.dto';
import { InfluencerService } from './influencer.service';
import { Response } from 'express';
import { FirebaseAuthGuard } from '@app/common';

@Controller('influencer')
@UseGuards(FirebaseAuthGuard)
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  //! ========================================== @GET ==============================================================

  @Get('/get-upcoming-meetings')
  async getUpcomingMeetings(
    @Res() response: Response,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('influencerId') influencerId: string,
  ) {
    try {
      const result = await this.influencerService.getUpcomingMeetings(
        +skip,
        +take,
        influencerId,
      );

      if (result.length > 0) {
        return response.status(HttpStatus.OK).send({
          success: true,
          message: 'Successfully fetched data',
          data: result,
        });
      } else {
        return response.status(HttpStatus.NO_CONTENT).send();
      }
    } catch (err) {
      response.status(HttpStatus.BAD_REQUEST).send({
        success: false,
        data: null,
        message: 'Something went wrong',
      });
    }
  }

  @Get('/get-pending-request-count')
  async getPendingRequestCount(
    @Res() response: Response,
    @Req() req: any,
    @Query('influencerId') influencerId: string,
  ) {
    try {
      const result = await this.influencerService.getPendingRequestsCount(
        influencerId,
      );

      return response.status(HttpStatus.OK).send({
        success: true,
        message: 'Successfully fetched',
        data: {
          count: result,
        },
      });
    } catch (err) {
      response.status(HttpStatus.BAD_REQUEST).send({
        success: false,
        data: null,
        message: 'Something went wrong',
      });
    }
  }

  @Get('/get-scheduled-meetings')
  async getScheduledMeetings(
    @Res() response: Response,
    @Query('influencerId') influencerId: string,
    @Query('date') date: string,
    @Query('meetingType') meetingType: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('sortKey') sortKey?: string,
    @Query('sortDirection') sortDirection?: string,
  ) {
    try {
      const result: any[] = await this.influencerService.getScheduledMeetings(
        influencerId,
        date,
        meetingType,
        +skip,
        +take,
        sortKey,
        sortDirection,
      );
      if (result && result.length > 0) {
        return response.status(HttpStatus.OK).send({
          success: true,
          message: 'Successfully fetched',
          data: result,
        });
      } else {
        return response.status(HttpStatus.NO_CONTENT).send();
      }
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        success: false,
        message: 'Something went wrong',
        data: err,
      });
    }
  }

  @Get('/get-pending-requests')
  async getPendingRequest(
    @Res() response: Response,
    @Query('influencerId') influencerId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('sortKey') sortKey?: string,
    @Query('sortDirection') sortDirection?: string,
  ) {
    try {
      const result: unknown[] = await this.influencerService.getPendingRequests(
        influencerId,
        skip,
        take,
        sortKey,
        sortDirection,
      );

      if (result.length > 0) {
        return response.status(HttpStatus.OK).send({
          success: true,
          message: 'Successfully fetched',
          data: result,
        });
      } else {
        return response.status(HttpStatus.NO_CONTENT).send();
      }
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        success: false,
        message: 'Something went wrong',
        data: err,
      });
    }
  }

  //! ========================================== @GET ==============================================================

  //! ========================================== @PATCH ==============================================================
  @Patch('/review-request-status')
  async reviewRequestStatus(
    @Res() response: Response,
    @Query('influencer_id') influencer_id: string,
    @Query('meetingId') meetingId: string,
    @Query('status') status: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('sortKey') sortKey: string,
    @Query('sortDirection') sortDirection: string,
  ) {
    try {
      const result = await this.influencerService.acceptPendingRequest(
        influencer_id,
        meetingId,
        status,
        skip,
        take,
        sortKey,
        sortDirection,
      );

      if (result.allMeetings.length > 0) {
        return response.status(HttpStatus.OK).send({
          success: true,
          data: result.allMeetings,
          message: 'Successfully Updated',
        });
      } else {
        return response.status(HttpStatus.NO_CONTENT).send();
      }
    } catch (err) {
      response.status(HttpStatus.BAD_REQUEST).send({
        success: false,
        data: null,
        message: 'Something went wrong',
      });
    }
  }

  //! ========================================== @PATCH ==============================================================

  //! ========================================== @POST ==============================================================
  @Post()
  async createInfluencer(
    @Req() req: any,
    @Body() request: CreateInfluencerRequest,
  ) {
    return await this.influencerService.createInfluencer(request);
  }
  //! ========================================== @POST ==============================================================
}
