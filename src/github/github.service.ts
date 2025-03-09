import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class GitHubService implements OnModuleInit {
  private octokit: any;
  private username: string;

  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {
    this.username = this.configService.get<string>('GITHUB_USERNAME');
  }

  async onModuleInit() {
    const { Octokit } = await import('@octokit/rest');
    this.octokit = new Octokit({
      auth: this.configService.get<string>('GITHUB_TOKEN'),
    });
  }

  async getUserProfile() {
    const cacheKey = this.cacheService.generateProfileCacheKey(this.username);
    console.log(cacheKey);
    const cachedData = await this.cacheService.get(cacheKey);
    console.log(cachedData);

    if (cachedData) {
      return cachedData;
    }

    try {
      const { data: user } = await this.octokit.users.getByUsername({
        username: this.username,
      });

      const { data: repos } = await this.octokit.repos.listForUser({
        username: this.username,
        sort: 'updated',
        per_page: 100,
      });

      const result = {
        username: user.login,
        name: user.name,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        repositories: repos.map((repo) => ({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          url: repo.html_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
        })),
      };

      await this.cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch GitHub profile: ${error.message}`);
    }
  }

  async getRepositoryDetails(repoName: string) {
    const cacheKey = this.cacheService.generateRepoCacheKey(
      this.username,
      repoName,
    );
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    try {
      const { data: repo } = await this.octokit.repos.get({
        owner: this.username,
        repo: repoName,
      });

      const { data: languages } = await this.octokit.repos.listLanguages({
        owner: this.username,
        repo: repoName,
      });

      const { data: contributors } = await this.octokit.repos.listContributors({
        owner: this.username,
        repo: repoName,
      });

      const { data: issues } = await this.octokit.issues.listForRepo({
        owner: this.username,
        repo: repoName,
        state: 'all',
        per_page: 10,
      });

      const result = {
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        open_issues: repo.open_issues_count,
        default_branch: repo.default_branch,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        languages,
        contributors: contributors.map((contributor) => ({
          username: contributor.login,
          contributions: contributor.contributions,
          avatar_url: contributor.avatar_url,
        })),
        recent_issues: issues.map((issue) => ({
          number: issue.number,
          title: issue.title,
          state: issue.state,
          created_at: issue.created_at,
          url: issue.html_url,
        })),
      };

      await this.cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(`Repository "${repoName}" not found`);
      }
      throw new Error(`Failed to fetch repository details: ${error.message}`);
    }
  }

  async createIssue(repoName: string, title: string, body: string) {
    try {
      const { data: issue } = await this.octokit.issues.create({
        owner: this.username,
        repo: repoName,
        title,
        body,
      });

      await this.cacheService.invalidateRepoCacheKey(this.username, repoName);

      return {
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        created_at: issue.created_at,
      };
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(`Repository "${repoName}" not found`);
      }
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }
}
