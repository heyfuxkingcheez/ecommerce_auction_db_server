import { join } from 'path';

// 서버 프로젝트의 루트 폴더
export const PROJECT_ROOT_PATH = process.cwd();

// 외부에서 접근 가능한 파일들을 모아둔 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';

// 유저 이미지들을 저장할 폴더 이름
export const USERS_FOLDER_NAME = 'users';

// 임시 폴더 이름
export const TEMP_FOLDER_NAME = 'temp';

export const ITEM_FOLDER_NAME = 'items';

// 실제 공개폴더의 절대 경로
// {프로젝트의 위치}/public
export const PUBLIC_FOLDER_PATH = join(
  PROJECT_ROOT_PATH,
  PUBLIC_FOLDER_NAME,
);

// 프로필 이미지를 저장할 폴더
// {프로젝트의 경로}/public/users
export const USER_PROFILE_IMAGE_PATH = join(
  PUBLIC_FOLDER_PATH,
  USERS_FOLDER_NAME,
);

export const ITEM_IMAGE_PATH = join(
  PUBLIC_FOLDER_PATH,
  ITEM_FOLDER_NAME,
);

// 절대경로 x
// /public/users/xxx.jpg
export const USER_PUBLIC_PROFILE_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  USERS_FOLDER_NAME,
);
// /public/items/xxx.jpg
export const ITEM_PUBLIC_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  ITEM_FOLDER_NAME,
);

// 임시 파일들을 저장할 폴더
// {프로젝트 경로}/temp
export const TEMP_FOLDER_PATH = join(
  PUBLIC_FOLDER_PATH,
  TEMP_FOLDER_NAME,
);
