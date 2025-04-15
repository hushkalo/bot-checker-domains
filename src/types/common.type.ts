export type ResponseCheckAvailableDomain = {
  status: string;
  message: string;
  name: string;
  status_code: number;
  url: string;
};

export type DomainStatusNotice = {
  name: string;
  url?: string;
  previousStatus: string | null;
  currentStatus: string;
};
