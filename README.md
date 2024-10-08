# E-commerce Auction Project

## 프로젝트 소개

판매자 구매자 모두 개인이 거래 주체로써 동일한 가격으로 입찰한 판매자와 구매자를 찾아 매칭한 후 판매자가 상품 발송 -> 검수 -> 구매자 상품 수령 -> 거래 완료 순으로 과정을 거치게 됩니다.
<br>

위와 같은 서비스를 제공하는 플랫폼에서 중개자, 정품 보증 역할을 맡기 때문에 판매자는 정품 보증을 위한 작업이 없어지고, 구매자는 보증 가능한 정품을 구매하는 데 있어 신뢰를 가질 수 있기 떄문에 불필요한 프로세스가 없어 이용자들이 편리하게 사용할 수 있습니다

## 링크

**GITHUB** : https://github.com/heyfuxkingcheez/ecommerce_auction_db_server

**API 명세서** : https://documenter.getpostman.com/view/35023103/2sA3s3JrQN

**브로셔** : https://roasted-crush-68f.notion.site/364d31141e0a42b6952cfc3b3ed96eec?pvs=4

## 서비스 아키텍처

![Service Architecture](https://github.com/user-attachments/assets/6caa0693-0266-4e60-aad8-3c97cedf4656)

## ERD

![image](https://github.com/user-attachments/assets/184ec4bb-2ee5-4a6b-b4c3-e3d26e8d030b)

## 기능

| 기능명               | 설명                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| **경매 입찰 시스템** | 사용자가 제품에 실시간으로 입찰하고, 알림을 받을 수 있습니다.        |
| **사용자 인증**      | JWT 토큰을 사용한 안전한 로그인 및 회원가입 기능.                    |
| **제품 관리**        | 제품의 세부 사항을 관리할 수 있는 CRUD 기능.                         |
| **결제 통합**        | 결제 게이트웨이와의 통합을 통해 안전하게 거래를 처리할 수 있습니다.  |
| **실시간 알림**      | 입찰 및 거래에 대한 실시간 업데이트를 사용자에게 전송.               |
| **배치 처리**        | 쿠폰 발급 및 대량 작업을 효율적으로 처리할 수 있는 배치 작업 최적화. |
| **오류 처리**        | 예기치 않은 문제를 관리하기 위한 강력한 오류 처리 및 로깅.           |
| **확장성**           | Redis와 Bull Queue를 활용한 분산 처리로 높은 트래픽을 처리 가능.     |

<br>

## 사용된 기술

| 기술명         | 설명                                                                                   |
| -------------- | -------------------------------------------------------------------------------------- |
| **NestJS**     | 효율적이고 확장 가능한 서버 측 애플리케이션을 구축하기 위한 진보된 Node.js 프레임워크. |
| **TypeScript** | 대규모 애플리케이션 개발을 위한 정적 타입의 JavaScript 확장 언어.                      |
| **TypeORM**    | 다양한 데이터베이스를 지원하는 TypeScript와 JavaScript용 ORM.                          |
| **Redis**      | 데이터베이스, 캐시, 메시지 브로커로 사용되는 인메모리 데이터 구조 저장소.              |
| **Bull Queue** | Redis 기반의 강력하고 개발자 친화적인 큐 시스템.                                       |
| **PostgreSQL** | 강력한 오픈 소스 객체 관계형 데이터베이스 시스템.                                      |
| **Docker**     | 일관된 환경을 제공하는 컨테이너화 도구.                                                |
| **JMeter**     | 성능 테스트 및 시스템 처리량 측정을 위한 도구.                                         |

<br>

## ENV

```
# DB
DB_HOST=YOUR_DB_HOST
DB_PORT=YOUR_DB_PORT
DB_USERNAME=YOUR_DB_USERNAME
DB_PASSWORD=YOUR_DB_PW
DB_DATABASE=YOUR_DB_DATABASE_NAME

# ENV
PORT=YOUR_SERVER_PORT
HOST=YOUR_SERVER_HOST
RUNTIME=test | prob
SERVICE_NAME=YOUR_SERVICE_NAME
URL=http://YOUR_SERVER_HOST:YOUR_SERVER_PORT

# BCRYPT
HASH_ROUNDS=

# JWT
JWT_SECRET=
JWT_ACCESS_EXP=
JWT_REFRESH_EXP=

# PG
API_SECRET=
CHANNEL_KEY=

# REDIS_QUEUE
REDIS_BULL_PORT=
REDIS_BULL_HOST=

# REDIS_LOCK
REDIS_LOCK1_PORT=
REDIS_LOCK2_PORT=
REDIS_LOCK3_PORT=
REDIS_LOCK4_PORT=
REDIS_LOCK5_PORT=
```
