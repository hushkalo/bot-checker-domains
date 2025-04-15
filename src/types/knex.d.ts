export type TNoticesDomain = Record<
  string,
  { isNoticed: boolean; status: string }
>;

interface UserData {
  name: string;
  hasStarted: boolean;
  lastAction: string;
  noticesDomain: TNoticesDomain;
  isBlocked: boolean;
}

declare module 'knex/types/tables' {
  interface User {
    id: number;
    telegram_user_id: number;
    telegram_chat_id: number;
    user_data: UserData;
    id_blocked: boolean;
    created_at: Date;
    updated_at: Date;
  }
  interface AvailableUser {
    id: number;
    telegram_user_id: number;
    created_at: Date;
    updated_at: Date;
  }
  interface CheckDomain {
    id: number;
    url: string;
    name: string;
    status: string;
    message: string;
    status_code: number;
    created_at: Date;
    updated_at: Date;
  }

  interface Tables {
    user: User;
    available_user: AvailableUser;
    domain: CheckDomain;
  }
}
