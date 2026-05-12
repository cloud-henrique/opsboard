const frontendPort = Number(globalThis.location?.port || 4200);
const backendPort = frontendPort >= 4200 && frontendPort < 4300
  ? 8000 + (frontendPort - 4200)
  : 8000;

export const environment = {
  production: false,
  apiUrl: `${globalThis.location?.protocol || 'http:'}//${globalThis.location?.hostname || 'localhost'}:${backendPort}`
};
