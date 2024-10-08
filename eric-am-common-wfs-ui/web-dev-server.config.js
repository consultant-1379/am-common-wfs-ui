/*
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 */

/* eslint consistent-return:0 */
import { string } from 'rollup-plugin-string';
import { fromRollup } from '@web/dev-server-rollup';
import proxy from 'koa-proxies';

const replaceCss = fromRollup(string);

const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  nodeResolve: {
    extensions: ['.mjs', '.cjs', '.js'],
    browser: true,
  },
  open: './',
  watch: !hmr,
  plugins: [replaceCss({ include: ['**/*.css', '**/*.json'] })],
  mimeTypes: {
    '**/index.css': 'css',
    // es-module-shim will convert to cssStylesheet, import for definition needs to be a string
    // Force application/javascript mimetype for all other css files
    '**/*.css': 'js',
  },
  middleware: [
    // Middleware uses Koa syntax -> https://github.com/koajs/koa
    // Warning!!!: Don't use destructuring on context when reading values, throws errors
    proxy('/vnfm/container', {
      target: 'http://localhost:10101',
      logs: true,
      rewrite: path => path.replace('/vnfm/container', ''),
    }),
    proxy('/vnflcm', {
      target: 'http://localhost:10101',
      logs: true,
    }),
    function mockExternals(context, next) {
      if (
        context.url ===
        '/oauth2/auth/realms/master/protocol/openid-connect/token'
      ) {
        context.body = {
          upgraded: false,
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjM1NmRlOS03MTIxLTQ3NTItYTFiYi0wNjQyZDAwMjQzM2QiLCJleHAiOjI1NzEyMzQyMTIsIm5iZiI6MCwiaWF0IjoyNTcxMjM0MTUyLCJpc3MiOiJodHRwczovL2tleWNsb2FrLmhtLW1hbnVhbC10ZXN0LTEudG9kZDA0MS5ybmQuZ2ljLmVyaWNzc29uLnNlL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InZuZm0iLCJzdWIiOiJhMjViYWFjOC1hMzhhLTQxNTQtYjFlOC1hY2RmNWQzMDczNjUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ2bmZtIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNzFlNTU2ZWEtOWMzYi00NTkyLTgzNTgtNDhkNmQ4N2UzNGFjIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2V2bmZtLmhtLW1hbnVhbC10ZXN0LTEudG9kZDA0MS5ybmQuZ2ljLmVyaWNzc29uLnNlIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJjcmVhdGUtcmVhbG0iLCJFLVZORk0gVXNlciBSb2xlIiwiVXNlckFkbWluIiwiRS1WTkZNIFJlYWQtb25seSBVc2VyIFJvbGUiLCJvZmZsaW5lX2FjY2VzcyIsIkUtVk5GTSBBRFAgQ0kgRmxvdyBSb2xlIiwiRS1WTkZNIFN1cGVyIFVzZXIgUm9sZSIsIkUtVk5GTSBVSSBVc2VyIFJvbGUiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibWFzdGVyLXJlYWxtIjp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJhdXRob3JpemF0aW9uIjp7InBlcm1pc3Npb25zIjpbeyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMDk4ODMwZTMtODRhNy00YWQ5LTk2YzgtMmEwN2IyYTljMDg4IiwicnNuYW1lIjoiRS1WTkZNIEVOTSBOb2RlIERlbGV0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMTE4OTYyYzItYWJhNS00MTE4LWJhZjUtYTgzZGRmODFhZDQ5IiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlIFVwZ3JhZGUgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIl0sInJzaWQiOiIxMTg5NjJjMi1hYmE1LTQxMTgtYmFmNS1hODNkZGY4MWFkNTkiLCJyc25hbWUiOiJFLVZORk0gTWFudWFsIFNjYWxlIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiIxZmQ0M2Q1MS02ZWExLTQwNjQtYWVkZS00NDJhNDgyNjk4NjMiLCJyc25hbWUiOiJFLVZORk0gQ2hhcnRzIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMjc5MjdjOTctNWFjNS00M2U1LWFjYTAtZWQxN2QwYWQzZjBmIiwicnNuYW1lIjoiRS1WTkZNIEVOTSBOb2RlIEludGVncmF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUFVUIl0sInJzaWQiOiIzMWYwZmY1ZC1jN2ZmLTQxMDAtYTI2MC1lN2FjM2MxYWI3NTYiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBPbmJvYXJkaW5nIFJlc291cmNlIn0seyJzY29wZXMiOlsiREVMRVRFIiwiUE9TVCIsIkdFVCIsIlBBVENIIiwiUFVUIl0sInJzaWQiOiIzMzMxYmYxNy0wNTQwLTQ3NTEtYjdjMi1mZmM2MjAzNjI4NDEiLCJyc25hbWUiOiJVc2VycyJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6IjRkZDZjODY1LWY5ZWEtNDNiNi05ZTIzLTk5NjI2YmJlNDM4OSIsInJzbmFtZSI6IkUtVk5GTSBJbnRlcm5hbCBQYWNrYWdlIE9uYm9hcmRpbmcgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJERUxFVEUiLCJHRVQiXSwicnNpZCI6IjgxNzcxOTE3LTg3YjUtNDVhOS1hOTk3LTVjNTJiNWE5MDZiYiIsInJzbmFtZSI6IkUtVk5GTSBQYWNrYWdlIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiI5YTk4OTIxYi05ODc1LTQ0MTctOTZkMS00OTlkNzY0YzBiOTgiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBJbmZvcm1hdGlvbiBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIkdFVCJdLCJyc2lkIjoiYTBhMjU3MWItMDhlNC00ZjQwLTg4NWUtMzI2MWY4ZjEwY2EwIiwicnNuYW1lIjoiRS1WTkZNIE9wZXJhdGlvbiBIaXN0b3J5IFJlc291cmNlIn0seyJzY29wZXMiOlsiREVMRVRFIiwiR0VUIiwiUEFUQ0giXSwicnNpZCI6ImE3Mjg1OTlhLWUwNjYtNGE5OC05ODI1LTY0ODRhY2ViNDljNSIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6ImE3YTFhZTFiLWQ5NzUtNGFiNS1hNTVkLWEwMzMwZTcyMjVjZiIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBJbnN0YW50aWF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCIsIkdFVCJdLCJyc2lkIjoiYjgwMGM3ZWMtYjY4YS00OTM4LTgwNmItZjU1NjU5M2EyZGUzIiwicnNuYW1lIjoiRS1WTkZNIFBhY2thZ2VzIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiYjZhOWI0NDMtNTUzZi00OTM3LWE2ZjEtMDgxODA3ZjNlNDY2IiwicnNuYW1lIjoiRS1WTkZNIE1hbnVhbCBSb2xsYmFjayBPcGVyYXRpb24ifSx7InNjb3BlcyI6WyJQT1NUIl0sInJzaWQiOiJiNmE5YjQ0My01NTNmLTQ5MzctYTZmMS0wODE4MDdmM2U2NDciLCJyc25hbWUiOiJFLVZORk0gTWFudWFsIEZhaWwgT3BlcmF0aW9uIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiYjZhOWI0NDMtNTUzZi00OTM3LWE2ZjEtMDgxODA3ZjNlNDY1IiwicnNuYW1lIjoiRS1WTkZNIE1hbnVhbCBIZWFsIFJlc291cmNlIn0seyJzY29wZXMiOlsiUFVUIl0sInJzaWQiOiI3ZWU4ZTM1ZC00NjI0LTQ1M2YtYjIwMC1kNTliNWE3ZjM5NzgiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBPbmJvYXJkaW5nIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCIsIkdFVCJdLCJyc2lkIjoiYjk5MTdkM2MtMmIzNy00NjNiLWJmMTQtYWQxYTUxODFjMGFmIiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlcyBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6ImJkNjc2ZjQ0LWNhOWUtNDNlYS1hOGRhLTg0MTQwOTFiN2I2ZiIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBUZXJtaW5hdGlvbiBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIkdFVCJdLCJyc2lkIjoiYzA4YzE5YzItY2M5Zi00NDg2LTlmYmMtODcwMjdjOTQwNDYzIiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlIEluZm9ybWF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiJjMDhjMTljMi1jYzlmLTQ0ODYtOWZiYy04NzAyMWM5NDA0NjMiLCJyc25hbWUiOiJFLVZORk0gUmVzb3VyY2UgRG93bmdyYWRlSW5mbyBSZXNvdXJjZSJ9LHsicnNpZCI6ImNiYzFhY2ZjLTg3NDUtNDRkNi04ZGQ2LTVkOTczYzY5YjFhZCIsInJzbmFtZSI6IkRlZmF1bHQgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJHRVQiXSwicnNpZCI6ImVlOTMzMjFmLTI0YjAtNDc1NC1iODFjLTRkNDYxODUxYzAyNyIsInJzbmFtZSI6IkUtVk5GTSBJbWFnZXMgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIiwiR0VUIiwiREVMRVRFIiwiUFVUIiwiUEFUQ0giXSwicnNpZCI6ImZhYzhjZGIwLTc0NTYtNDlmOC1hMDdlLTgzMjg4ODBiMjM3MyIsInJzbmFtZSI6IkUtVk5GTSBDbHVzdGVyIENvbmZpZ3VyYXRpb24gUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIiwiR0VUIiwiREVMRVRFIl0sInJzaWQiOiJjMDhxMjljMi1jYzlmLTU3ODYtOWZiYy04NzAyMWM5MTA0NjMiLCJyc25hbWUiOiJFLVZORk0gQmFja3VwIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiI5NTUwYWUyZS00Y2IzLTQwZmYtODVjNC01MGQxNWYzZDBiNmMiLCJyc25hbWUiOiJFLVZORk0gQmFja3VwIFNjb3BlcyBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6IjY2YjA3YWRlLWEyYTUtNGFkMi04NTZmLWU4MDc5OTAzODhmNCIsInJzbmFtZSI6IkUtVk5GTSBTeW5jcm9uaXplIFJlc291cmNlIn1dfSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiJ9.v5mYZf53IUaFJaXarM8bM3BLqfxj_Ef1msNCGx5vsnk',
          expires_in: 60,
          refresh_expires_in: 1800,
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjM1NmRlOS03MTIxLTQ3NTItYTFiYi0wNjQyZDAwMjQzM2QiLCJleHAiOjI1NzEyMzQyMTIsIm5iZiI6MCwiaWF0IjoyNTcxMjM0MTUyLCJpc3MiOiJodHRwczovL2tleWNsb2FrLmhtLW1hbnVhbC10ZXN0LTEudG9kZDA0MS5ybmQuZ2ljLmVyaWNzc29uLnNlL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InZuZm0iLCJzdWIiOiJhMjViYWFjOC1hMzhhLTQxNTQtYjFlOC1hY2RmNWQzMDczNjUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ2bmZtIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNzFlNTU2ZWEtOWMzYi00NTkyLTgzNTgtNDhkNmQ4N2UzNGFjIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2V2bmZtLmhtLW1hbnVhbC10ZXN0LTEudG9kZDA0MS5ybmQuZ2ljLmVyaWNzc29uLnNlIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJjcmVhdGUtcmVhbG0iLCJFLVZORk0gVXNlciBSb2xlIiwiVXNlckFkbWluIiwiRS1WTkZNIFJlYWQtb25seSBVc2VyIFJvbGUiLCJvZmZsaW5lX2FjY2VzcyIsIkUtVk5GTSBBRFAgQ0kgRmxvdyBSb2xlIiwiRS1WTkZNIFN1cGVyIFVzZXIgUm9sZSIsIkUtVk5GTSBVSSBVc2VyIFJvbGUiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibWFzdGVyLXJlYWxtIjp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJhdXRob3JpemF0aW9uIjp7InBlcm1pc3Npb25zIjpbeyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMDk4ODMwZTMtODRhNy00YWQ5LTk2YzgtMmEwN2IyYTljMDg4IiwicnNuYW1lIjoiRS1WTkZNIEVOTSBOb2RlIERlbGV0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMTE4OTYyYzItYWJhNS00MTE4LWJhZjUtYTgzZGRmODFhZDQ5IiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlIFVwZ3JhZGUgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIl0sInJzaWQiOiIxMTg5NjJjMi1hYmE1LTQxMTgtYmFmNS1hODNkZGY4MWFkNTkiLCJyc25hbWUiOiJFLVZORk0gTWFudWFsIFNjYWxlIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiIxZmQ0M2Q1MS02ZWExLTQwNjQtYWVkZS00NDJhNDgyNjk4NjMiLCJyc25hbWUiOiJFLVZORk0gQ2hhcnRzIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMjc5MjdjOTctNWFjNS00M2U1LWFjYTAtZWQxN2QwYWQzZjBmIiwicnNuYW1lIjoiRS1WTkZNIEVOTSBOb2RlIEludGVncmF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUFVUIl0sInJzaWQiOiIzMWYwZmY1ZC1jN2ZmLTQxMDAtYTI2MC1lN2FjM2MxYWI3NTYiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBPbmJvYXJkaW5nIFJlc291cmNlIn0seyJzY29wZXMiOlsiREVMRVRFIiwiUE9TVCIsIkdFVCIsIlBBVENIIiwiUFVUIl0sInJzaWQiOiIzMzMxYmYxNy0wNTQwLTQ3NTEtYjdjMi1mZmM2MjAzNjI4NDEiLCJyc25hbWUiOiJVc2VycyJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6IjRkZDZjODY1LWY5ZWEtNDNiNi05ZTIzLTk5NjI2YmJlNDM4OSIsInJzbmFtZSI6IkUtVk5GTSBJbnRlcm5hbCBQYWNrYWdlIE9uYm9hcmRpbmcgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJERUxFVEUiLCJHRVQiXSwicnNpZCI6IjgxNzcxOTE3LTg3YjUtNDVhOS1hOTk3LTVjNTJiNWE5MDZiYiIsInJzbmFtZSI6IkUtVk5GTSBQYWNrYWdlIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiI5YTk4OTIxYi05ODc1LTQ0MTctOTZkMS00OTlkNzY0YzBiOTgiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBJbmZvcm1hdGlvbiBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIkdFVCJdLCJyc2lkIjoiYTBhMjU3MWItMDhlNC00ZjQwLTg4NWUtMzI2MWY4ZjEwY2EwIiwicnNuYW1lIjoiRS1WTkZNIE9wZXJhdGlvbiBIaXN0b3J5IFJlc291cmNlIn0seyJzY29wZXMiOlsiREVMRVRFIiwiR0VUIiwiUEFUQ0giXSwicnNpZCI6ImE3Mjg1OTlhLWUwNjYtNGE5OC05ODI1LTY0ODRhY2ViNDljNSIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6ImE3YTFhZTFiLWQ5NzUtNGFiNS1hNTVkLWEwMzMwZTcyMjVjZiIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBJbnN0YW50aWF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCIsIkdFVCJdLCJyc2lkIjoiYjgwMGM3ZWMtYjY4YS00OTM4LTgwNmItZjU1NjU5M2EyZGUzIiwicnNuYW1lIjoiRS1WTkZNIFBhY2thZ2VzIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiYjZhOWI0NDMtNTUzZi00OTM3LWE2ZjEtMDgxODA3ZjNlNDY2IiwicnNuYW1lIjoiRS1WTkZNIE1hbnVhbCBSb2xsYmFjayBPcGVyYXRpb24ifSx7InNjb3BlcyI6WyJQT1NUIl0sInJzaWQiOiJiNmE5YjQ0My01NTNmLTQ5MzctYTZmMS0wODE4MDdmM2U2NDciLCJyc25hbWUiOiJFLVZORk0gTWFudWFsIEZhaWwgT3BlcmF0aW9uIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiYjZhOWI0NDMtNTUzZi00OTM3LWE2ZjEtMDgxODA3ZjNlNDY1IiwicnNuYW1lIjoiRS1WTkZNIE1hbnVhbCBIZWFsIFJlc291cmNlIn0seyJzY29wZXMiOlsiUFVUIl0sInJzaWQiOiI3ZWU4ZTM1ZC00NjI0LTQ1M2YtYjIwMC1kNTliNWE3ZjM5NzgiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBPbmJvYXJkaW5nIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCIsIkdFVCJdLCJyc2lkIjoiYjk5MTdkM2MtMmIzNy00NjNiLWJmMTQtYWQxYTUxODFjMGFmIiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlcyBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6ImJkNjc2ZjQ0LWNhOWUtNDNlYS1hOGRhLTg0MTQwOTFiN2I2ZiIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBUZXJtaW5hdGlvbiBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIkdFVCJdLCJyc2lkIjoiYzA4YzE5YzItY2M5Zi00NDg2LTlmYmMtODcwMjdjOTQwNDYzIiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlIEluZm9ybWF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiJjMDhjMTljMi1jYzlmLTQ0ODYtOWZiYy04NzAyMWM5NDA0NjMiLCJyc25hbWUiOiJFLVZORk0gUmVzb3VyY2UgRG93bmdyYWRlSW5mbyBSZXNvdXJjZSJ9LHsicnNpZCI6ImNiYzFhY2ZjLTg3NDUtNDRkNi04ZGQ2LTVkOTczYzY5YjFhZCIsInJzbmFtZSI6IkRlZmF1bHQgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJHRVQiXSwicnNpZCI6ImVlOTMzMjFmLTI0YjAtNDc1NC1iODFjLTRkNDYxODUxYzAyNyIsInJzbmFtZSI6IkUtVk5GTSBJbWFnZXMgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIiwiR0VUIiwiREVMRVRFIiwiUFVUIiwiUEFUQ0giXSwicnNpZCI6ImZhYzhjZGIwLTc0NTYtNDlmOC1hMDdlLTgzMjg4ODBiMjM3MyIsInJzbmFtZSI6IkUtVk5GTSBDbHVzdGVyIENvbmZpZ3VyYXRpb24gUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIiwiR0VUIiwiREVMRVRFIl0sInJzaWQiOiJjMDhxMjljMi1jYzlmLTU3ODYtOWZiYy04NzAyMWM5MTA0NjMiLCJyc25hbWUiOiJFLVZORk0gQmFja3VwIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiI5NTUwYWUyZS00Y2IzLTQwZmYtODVjNC01MGQxNWYzZDBiNmMiLCJyc25hbWUiOiJFLVZORk0gQmFja3VwIFNjb3BlcyBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6IjY2YjA3YWRlLWEyYTUtNGFkMi04NTZmLWU4MDc5OTAzODhmNCIsInJzbmFtZSI6IkUtVk5GTSBTeW5jcm9uaXplIFJlc291cmNlIn1dfSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiJ9.v5mYZf53IUaFJaXarM8bM3BLqfxj_Ef1msNCGx5vsnk',
          token_type: 'Bearer',
          'not-before-policy': 0,
        };

        return;
      }
      // Sample for mocking external service responses
      // if(context.url === '/rest/v1'){
      // context.body = {
      //   mock: 'response',
      // }
      // // Return undefined serves the result in current state
      // return;
      // }

      // Signal move to next middleware function, do not remove
      return next();
    },
    function publicAssets(context, next) {
      // Don't mess with any of these requests
      const nonPublic = ['/src', '/node_modules', '/__web-dev-server'];
      for (const folder of nonPublic) {
        if (context.url.startsWith(folder)) {
          return next();
        }
      }

      // Send everything else to public folder
      context.url = `public${context.url}`;
      return next();
    },
    // Do not define any further middleware after this point
    // Anything marked with next will now be passed through
    // the web-dev-server middleware and compiled if needed.
  ],
});
