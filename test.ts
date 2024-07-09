/* eslint-disable no-console */
/* eslint-disable no-return-await */

const delay = (time: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      console.log('setimeout done !!');
      res('done!!');
    }, time);
  });
};

const foo = async (number: number) => {
  console.log(`foo ${number}`);
  const data = await delay(2000);
  return data;
};

const bar = async () => {
  console.log('bar 시작');

  const foo1Res = foo(100);
  console.log('foo1res : ', foo1Res);

  console.log('bar');
  const foo2Res = foo(200);
  console.log('foo2res : ', foo2Res);

  console.log('bar 종료');
};

bar();
