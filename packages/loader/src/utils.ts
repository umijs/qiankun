export function isUrlHasOwnProtocol(url: string): boolean {
  const protocols = ['http://', 'https://', '//', 'blob:', 'data:'];
  return protocols.some((protocol) => url.startsWith(protocol));
}
