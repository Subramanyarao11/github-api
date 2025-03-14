import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { GitHubService } from './github.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('github')
@UseGuards(ThrottlerGuard)
export class GitHubController {
  constructor(private readonly gitHubService: GitHubService) {}

  @Get()
  async getUserProfile() {
    return this.gitHubService.getUserProfile();
  }

  @Get(':repoName')
  async getRepositoryDetails(@Param('repoName') repoName: string) {
    return this.gitHubService.getRepositoryDetails(repoName);
  }

  @Post(':repoName/issues')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createIssue(
    @Param('repoName') repoName: string,
    @Body() createIssueDto: CreateIssueDto,
  ) {
    return this.gitHubService.createIssue(
      repoName,
      createIssueDto.title,
      createIssueDto.body,
    );
  }
}
