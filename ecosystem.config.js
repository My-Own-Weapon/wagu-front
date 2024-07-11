module.exports = {
  apps: [
    {
      name: 'wagu-front',
      script: 'npm',
      args: 'run start',
      instances: 'max', // 모든 CPU 코어 사용 (ec2의 cpu)
      exec_mode: 'cluster', // 클러스터 모드로 실행
      watch: true, // 파일 변경 감지
      max_memory_restart: '1G', // 메모리 제한 (해당 메모리 이상을 사용하면 재시작)
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
