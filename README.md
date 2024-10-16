# README

![Frame 1000002916.png](README_data/logo.png)

# 🍖 와구 북

---

**_흔한 맛집 리뷰는 가라! 새로운 맛집 기록, 공유, 참여_**

친구와 약속을 잡을 때, “**여기 어때?**” 라고 물어보고 한참 뒤에 답변을 받은 경험이 있으신가요?🥹

내가 가본 맛집들을 **간편하게 기록**할 수 있는 서비스가 필요하지 않으신가요?🤓

**WAGU BOOK**은 이런 분들을 위해 **기록 공유 참여**에 초점을 둔 맛집 서비스입니다!

**편하게 작성**하고 **빠르게 소통**하세요!!

### 나만의 포스팅을 작성해보세요! 🤌

<div style='display: flex; align-items: center; justify-content: center;'>
    <img src="README_data/category.png" style="width: 90%; background-color: white">
</div>

<div style='display:flex; justify-content: space-between'>
    <img src="README_data/post1.png" style="width: 46%;">
    <img src="README_data/post2.png" style="width: 45%;">
</div>

## 🔗 와구 북 서비스 및 노션

---

### [🍷 와구북 바로가기](https://www.wagubook.shop/entry)

### [🍷 팀 노션](https://www.notion.so/ed4ab46bcb134c68a7a37eed19deb004?pvs=21)

## 📢 주요 서비스 기능

---

### 🍷 포스트 자동 생성 기능

“사진으로 간단하게 기록을 완성하세요!”

- 포스트를 작성할 때, [이미지, 음식점, 메뉴] 정보를 입력해서 AI를 통해 리뷰를 자동으로 작성할 수 있습니다
- AI리뷰를 사용하지 않거나, 수정할 수도 있습니다

<div style="display: flex; justify-content: space-around;">
    <img src="README_data/main.png" style="width: 45%;">
    <img src="README_data/postDetail.png" style="width: 45%;">
</div>

### 🍷 친구들과 함께 맛집 찾기

“음성채팅과 친구들이 보고있는 장소를 확인하며 친구들과 소통하며 맛집을 골라보세요!”

- 생성된 링크에서 친구들과 실시간으로 지도를 보며 식당을 탐색할 수 있습니다
- 몇몇 식당을 선택하고 투표를 통해 가고싶은 맛집을 선택해보세요
- 지도에서는 친구들이 실시간으로 보고있는 위치를 확인할 수 있습니다
- 음성채팅으로 대화하며 의견을 공유해 보세요

<div style="display: flex; justify-content: space-around;">
    <img src="README_data/shareMap.png" style="width: 45%;">
    <img src="README_data/vote.png" style="width: 45%;">
</div>

### 🍷 라이브 스트리밍

“실시간으로 음식의 감동을 공유하세요!!”

- 라이브 스트리밍을 통해 자신의 먹방을 자랑할 수 있습니다
- 스트리밍에 참여하는 채팅을 통해 상호작용하며 맛집 탐색에 도움을 받아보세요

<div style="display: flex; justify-content: flex-start;">
    <img src="README_data/live.png" style="width: 45%;">
</div>

## ⚙️ 서비스 아키텍쳐

---

![피피티용.png](README_data/architecture.png)

![오른쪽.png](README_data/challenge.png)

## 📌 핵심 기술

---

- 실시간 통신 기술
  - 음성 및 스트리밍 서비스를 위한 SFU 방식 WebRTC 서버 구현
  - 미디어 서버 Openvidu 사용
  - 채팅, 좌표 데이터 전달을 위한 WebSocket 서버 구현
- 디자이너가 있는 팀이라 가정하고 디자인토큰 파싱 로직 구현
- 빠른 개발을 위한 UI 컴포넌트 시스템 개발
- 이미지 업로드 시 효율적인 공간 사용 및 로딩 최적화를 위해 Graphics2D를 사용한 이미지 리사이징
- 동시성 문제(Race Condition) 해결을 위해 Redis를 사용한 분산 Spin-Lock 구현
- 유지할 필요가 없는 공유, 투표 데이터 Redis 사용한 일시 저장
- 프론트의 경우 AWS ec2 / S3 / codedeploy / pm2 를 통한 CI/CD 무중단 배포 구현
- 백엔드의 경우 Github Actions/AWS ALB/Docker를 통한 blue-green 배포방식의 CI/CD 무중단 배포 구현
- 미디어 전송 서버와 데이터 전송 서버를 구분하여 확장성 증가

## 📝 기술적 의사 결정

---

### 기술적 의사 결정 요약

| 기술                                           | 도입 이유                                       | 후보군                              | 의견 조율 및 기술 결정                   |
| ---------------------------------------------- | ----------------------------------------------- | ----------------------------------- | ---------------------------------------- |
| **Web Socket**                                 | 채팅, 데이터 전송                               | Polling / Long Polling / Web Socket | WebSocket 사용 결정                      |
| **WebRTC (SFU)**                               | 실시간 스트리밍 및 음성                         | HLS / Mesh / SFU / MCU              | WebRTC (SFU) 사용 결정                   |
| **Redis (Lettuce)**                            | TTL이 필요한 데이터를 저장하기 위한 DB 선정     | Lettuce / Redisson                  | Lettuce 사용 결정                        |
| **Github Action & DockerHub / AWS CodeDeploy** | 지속적 통합과 지속적 배포를 통한 업무 효율 상승 | Jenkins / Github Action / Travis CI | Github Action과 AWS CodeDeploy 사용 결정 |

---

### 세부 내용

- **WebRTC (SFU)**

  - HLS와 같은 선택지가 있었지만, WebRTC를 사용하게 된 이유는 기본적으로 **낮은 지연 시간(Low Latency)** 때문입니다.
  - HLS는 기본적으로 HTTP 기반의 프로토콜이기 때문에 초 단위의 지연이 발생할 수 있지만, WebRTC는 P2P 연결을 기반으로 하여 매우 낮은 지연 시간을 제공합니다.
  - WebRTC는 단순한 영상 전송뿐만 아니라 오디오와 데이터를 포함한 양방향 통신을 지원합니다.
  - 짧은 기간 내에 WebRTC를 직접 구현하는 것은 어렵다고 판단하였으며, OpenVidu를 Spring Boot에 이식하여 구현하기로 결정했습니다.
  - 클라이언트 측에서 세션을 생성하는 요청이 들어오면, Spring의 컨트롤러가 해당 요청을 받아 OpenVidu로 전달하고, OpenVidu가 세션을 관리하는 방식으로 구현합니다.

- **Redis (Lettuce)**

  - TTL이 필요한 데이터를 저장하는 DB로 Lettuce를 선정했습니다.
  - 투표 기능에서, 투표가 종료되면 데이터를 DB에 계속 저장하는 것은 낭비라고 판단했습니다.
  - 투표하기 기능에서 여러 사용자가 동시에 같은 가게에 투표할 경우, 투표 결과가 1번만 반영되는 문제를 해결하기 위해 락이 필요했습니다.
  - Lettuce는 Redisson보다 가벼우며, 단순한 락 기능을 위해 추가적인 종속성과 복잡성을 도입하는 것보다 효율적입니다.
  - Lettuce를 사용하여 Spinlock을 직접 구현함으로써, 락 획득과 해제를 직접 관리하여 성능 최적화를 달성할 수 있습니다.
  - Spinlock은 자원을 기다릴 때 CPU를 사용하여 반복적으로 시도하는 방식이며, 락의 타임아웃, 재시도 횟수, 대기 시간을 조정할 수 있어 특정 상황에 맞춘 최적화가 가능합니다.

- **Github Action & DockerHub / AWS CodeDeploy**
  - 지속적 통합과 지속적 배포를 위해 Github Action과 AWS CodeDeploy를 사용하기로 결정했습니다.
  - 현재 프로젝트 관리는 GitHub를 통해 진행 중이며, 소규모 프로젝트이고 추가 설치 과정 없이 GitHub에서 제공하는 환경에서 CI 작업이 가능하기 때문에 Github Action을 사용하는 것이 적합하다고 판단했습니다.
  - 프로젝트 규모를 고려하여 초기 설정이 적고 편의성이 높아 리소스를 줄이는 방향으로 진행했으며, 자동화 배포를 위해 Github Action과 AWS CodeDeploy를 사용하기로 결정했습니다.

## ⚽ 트러블 슈팅

---

- Blue-Green배포 시 세션 로그인 문제
  - **문제 상황**
    - 두 개의 서버가 띄워져 있을 때 로드밸런서를 통해 Round Robin 방식으로 트래픽이 분산되는 경우 세션 로그인이 유지되지 못하는 문제가 발생했습니다.
  - **이유**
    - 기본적으로 AWS ALB의 경우 Round Robin 방식으로 트래픽을 분산시키기 때문에 세션로그인을 통해 로그인 하고 쿠키에 박혀있는 세션은 첫 번째 서버에서 인증받은 세션입니다. 빌드가 완료된 다음 서버에 연결할 때는 다른 서버로 연결이 되기 때문에 인증에 실패하게 됩니다.
  - **해결 방법**
    - AWS 로드밸런서의 트래픽 분산 방식을 Sticky 방식으로 변경했습니다. Sticky 방식은 이전에 서버에 접근한 기록이 있는 경우에는 동일한 서버로 트래픽을 분산하는 방식입니다.

## 🗨️ 유저 피드백

- 유저 피드백

## ⌛ 시간이 더 있었다면 도전했을 기술들

- useExternalStore를 사용한 상태 관리
- 대용량 트래픽 처리(Docker를 사용한 scale-out)
- Graphics2D를 사용하지 않고 픽셀 보간법을 사용해서 이미지 리사이징과 복원
- 소셜 로그인(카카오, 네이버, 구글)

## 🛠 기술 스택

### Frontend Tech Stack

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white"><p>

<img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"><p>

<img src="https://img.shields.io/badge/tanstack query-000000?style=for-the-badge&logo=reactquery&logoColor=white"><p>

<img src="https://img.shields.io/badge/zustand-FFD700?style=for-the-badge&logo=zustand&logoColor=white"><p>

<img src="https://img.shields.io/badge/websocket-FFCD00?style=for-the-badge&logo=websocket&logoColor=white"><p>

<img src="https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=WebRTC&logoColor=white"><p>

### Backend Tech Stack

<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"><p>

<img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"><p>

<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"><p>

<img src="https://img.shields.io/badge/spring security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"><p>

<img src="https://img.shields.io/badge/websocket-FFCD00?style=for-the-badge&logo=websocket&logoColor=white"><p>

<img src="https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=WebRTC&logoColor=white"><p>

### Infrastructure

<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><p>

<img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"><p>

<img src="https://img.shields.io/badge/amazon ec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"><p>

<img src="https://img.shields.io/badge/amazon s3-569A31?style=for-the-badge&logo=amazons3&logoColor=white"><p>

<img src="https://img.shields.io/badge/amazon rds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white"><p>

<img src="https://img.shields.io/badge/amazon cloudfront-FF4F8B?style=for-the-badge&logo=amazonaws&logoColor=white"><p>

<img src="https://img.shields.io/badge/amazon route53-7D929E?style=for-the-badge&logo=amazonaws&logoColor=white"><p>

<img src="https://img.shields.io/badge/aws codedeploy-FF9E9F?style=for-the-badge&logo=amazonaws&logoColor=white"><p>

<img src="https://img.shields.io/badge/github actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"><p>

### Team Collaboration Tool

<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"><p>

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"><p>

<img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"><p>

<img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"><p>

<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"><p>

<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"><p>

<img src="https://img.shields.io/badge/intellij idea-000000?style=for-the-badge&logo=intellijidea&logoColor=white"><p>

## 🧑🏻‍💻 개발 기간 & 조원

✔️ 2024.5.30 - 2024.07.27
