export const axiosErrorCodeMap: Record<string, string> = {
  ECONNABORTED: 'Request timed out.',
  ENOTFOUND: 'Server not found. Please check the domain name.',
  ECONNREFUSED: 'Connection refused. The server may be offline.',
  EHOSTUNREACH: 'Host is unreachable. Please check your network.',
  ECONNRESET: 'Connection was reset unexpectedly.',
  EAI_AGAIN: 'DNS lookup timed out. Try again later.',
  ETIMEDOUT: 'Connection attempt timed out.',
  DEPTH_ZERO_SELF_SIGNED_CERT: 'SSL error: self-signed certificate.',
};
