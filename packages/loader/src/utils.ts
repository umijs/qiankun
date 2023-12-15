export function getEntireUrl(uri: string, baseURI: string): string {
  const publicPath = new URL(baseURI, window.location.href);
  const entireUrl = new URL(uri, publicPath.toString());
  return entireUrl.toString();
}

export function isUrlHasOwnProtocol(url: string): boolean {
  const protocols = ['http://', 'https://', '//', 'blob:', 'data:'];
  return protocols.some((protocol) => url.startsWith(protocol));
}
