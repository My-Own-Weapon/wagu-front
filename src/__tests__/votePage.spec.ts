import { test } from '@playwright/test';
import VotePageModel from './pageModel/VotePageModel';

test.describe('Vote Page', () => {
  test('다중 사용자 투표 테스트', async ({ browser }) => {
    // 3개의 브라우저 컨텍스트 생성
    const userContext1 = await browser.newContext();
    const userContext2 = await browser.newContext();
    const userContext3 = await browser.newContext();

    // 각 컨텍스트에 대한 페이지 생성
    const user1Page = await userContext1.newPage();
    const user2Page = await userContext2.newPage();
    const user3Page = await userContext3.newPage();

    // 각 사용자 로그인 처리
    const A = new VotePageModel(user1Page);
    const B = new VotePageModel(user2Page);
    const C = new VotePageModel(user3Page);

    await A.login('qwe');
    await B.login('asd');
    await C.login('zxc');

    // 동일한 투표 세션에 접속
    const voteUrl = await A.goToMapPage()
      .then((A) => A.goToVotePage())
      .then((A) => A.getVoteUrl());

    await B.joinVotePage(voteUrl);
    await C.joinVotePage(voteUrl);

    const marker = await A.getMarker();

    await A.clickMarker(marker);

    expect(await A.getNominateStores()).toHaveLength(1);

    // 컨텍스트 정리
    await userContext1.close();
    await userContext2.close();
    await userContext3.close();
  });
});
