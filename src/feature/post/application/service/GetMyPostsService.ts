import { GetMyPostsQuery } from '@/feature/post/application/port/in/GetMyPostsQuery';
import type { FetchMyPostPort } from '@/feature/post/application/port/out/FetchMyPostPort';
import { singleton, inject } from 'tsyringe';

export const FETCH_MY_POST_PORT_TOKEN = Symbol('FetchMyPostPort');

@singleton()
export default class GetMyPostsService implements GetMyPostsQuery {
  private readonly fetchMyPostPort: FetchMyPostPort;

  constructor(
    @inject(FETCH_MY_POST_PORT_TOKEN)
    fetchMyPostPort: FetchMyPostPort,
  ) {
    this.fetchMyPostPort = fetchMyPostPort;
  }

  public fetchMyPosts = async ({
    page,
    size,
  }: {
    page: number;
    size: number;
  }) => {
    return this.fetchMyPostPort.fetchMyPosts({ page, size });
  };
}
