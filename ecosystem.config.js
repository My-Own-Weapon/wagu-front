/* eslint-disable camelcase */

module.exports = {
  apps: [
    {
      name: 'wagu-front',
      script: 'npm',
      args: 'run start',
      instances: 'max', // 모든 CPU 코어 사용 (ec2의 cpu)
      exec_mode: 'cluster', // 클러스터 모드로 실행
      // 파일 변경 감지 (false reson : code deploy가 node module을 install 할때마다 계속 변경하는것 같음 그래서 restart가 엄청 많이됨)
      watch: false,
      max_memory_restart: '1G', // 메모리 제한 (해당 메모리 이상을 사용하면 재시작)
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
