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
const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");

module.exports = app => {
  app.use(
    "/vnflcm",
    proxy("localhost:8080", {
      proxyReqOptDecorator: function(proxyReqOpts) {
        proxyReqOpts.port = "10101";
        return proxyReqOpts;
      },
      proxyReqPathResolver: function(req) {
        return "/vnflcm" + req.url;
      }
    })
  );

  app.use(
    "/vnfm/onboarding",
    proxy("localhost:8080", {
      proxyReqOptDecorator: function(proxyReqOpts) {
        proxyReqOpts.port = "10102";

        // workaround for stubs
        const { path, method } = proxyReqOpts;
        const hasDeletePackage = path.includes("/api/vnfpkgm/v1/vnf_packages/") && method === "DELETE";

        if (hasDeletePackage) {
          proxyReqOpts.headers["Idempotency-key"] = "dummyKey";
        }

        return proxyReqOpts;
      }
    })
  );

  app.post("/oauth2/auth/realms/master/protocol/openid-connect/token", function(req, res) {
    const token = {
      upgraded: false,
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjM1NmRlOS03MTIxLTQ3NTItYTFiYi0wNjQyZDAwMjQzM2QiLCJleHAiOjI1NzEyMzQyMTIsIm5iZiI6MCwiaWF0IjoyNTcxMjM0MTUyLCJpc3MiOiJodHRwczovL2tleWNsb2FrLmhtLW1hbnVhbC10ZXN0LTEudG9kZDA0MS5ybmQuZ2ljLmVyaWNzc29uLnNlL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InZuZm0iLCJzdWIiOiJhMjViYWFjOC1hMzhhLTQxNTQtYjFlOC1hY2RmNWQzMDczNjUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ2bmZtIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNzFlNTU2ZWEtOWMzYi00NTkyLTgzNTgtNDhkNmQ4N2UzNGFjIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2V2bmZtLmhtLW1hbnVhbC10ZXN0LTEudG9kZDA0MS5ybmQuZ2ljLmVyaWNzc29uLnNlIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJjcmVhdGUtcmVhbG0iLCJFLVZORk0gVXNlciBSb2xlIiwiVXNlckFkbWluIiwiRS1WTkZNIFJlYWQtb25seSBVc2VyIFJvbGUiLCJvZmZsaW5lX2FjY2VzcyIsIkUtVk5GTSBBRFAgQ0kgRmxvdyBSb2xlIiwiRS1WTkZNIFN1cGVyIFVzZXIgUm9sZSIsIkUtVk5GTSBVSSBVc2VyIFJvbGUiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibWFzdGVyLXJlYWxtIjp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJhdXRob3JpemF0aW9uIjp7InBlcm1pc3Npb25zIjpbeyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMDk4ODMwZTMtODRhNy00YWQ5LTk2YzgtMmEwN2IyYTljMDg4IiwicnNuYW1lIjoiRS1WTkZNIEVOTSBOb2RlIERlbGV0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMTE4OTYyYzItYWJhNS00MTE4LWJhZjUtYTgzZGRmODFhZDQ5IiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlIFVwZ3JhZGUgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIl0sInJzaWQiOiIxMTg5NjJjMi1hYmE1LTQxMTgtYmFmNS1hODNkZGY4MWFkNTkiLCJyc25hbWUiOiJFLVZORk0gTWFudWFsIFNjYWxlIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiIxZmQ0M2Q1MS02ZWExLTQwNjQtYWVkZS00NDJhNDgyNjk4NjMiLCJyc25hbWUiOiJFLVZORk0gQ2hhcnRzIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMjc5MjdjOTctNWFjNS00M2U1LWFjYTAtZWQxN2QwYWQzZjBmIiwicnNuYW1lIjoiRS1WTkZNIEVOTSBOb2RlIEludGVncmF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUFVUIl0sInJzaWQiOiIzMWYwZmY1ZC1jN2ZmLTQxMDAtYTI2MC1lN2FjM2MxYWI3NTYiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBPbmJvYXJkaW5nIFJlc291cmNlIn0seyJzY29wZXMiOlsiREVMRVRFIiwiUE9TVCIsIkdFVCIsIlBBVENIIiwiUFVUIl0sInJzaWQiOiIzMzMxYmYxNy0wNTQwLTQ3NTEtYjdjMi1mZmM2MjAzNjI4NDEiLCJyc25hbWUiOiJVc2VycyJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6IjRkZDZjODY1LWY5ZWEtNDNiNi05ZTIzLTk5NjI2YmJlNDM4OSIsInJzbmFtZSI6IkUtVk5GTSBJbnRlcm5hbCBQYWNrYWdlIE9uYm9hcmRpbmcgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJERUxFVEUiLCJHRVQiXSwicnNpZCI6IjgxNzcxOTE3LTg3YjUtNDVhOS1hOTk3LTVjNTJiNWE5MDZiYiIsInJzbmFtZSI6IkUtVk5GTSBQYWNrYWdlIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiI5YTk4OTIxYi05ODc1LTQ0MTctOTZkMS00OTlkNzY0YzBiOTgiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBJbmZvcm1hdGlvbiBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIkdFVCJdLCJyc2lkIjoiYTBhMjU3MWItMDhlNC00ZjQwLTg4NWUtMzI2MWY4ZjEwY2EwIiwicnNuYW1lIjoiRS1WTkZNIE9wZXJhdGlvbiBIaXN0b3J5IFJlc291cmNlIn0seyJzY29wZXMiOlsiREVMRVRFIiwiR0VUIiwiUEFUQ0giXSwicnNpZCI6ImE3Mjg1OTlhLWUwNjYtNGE5OC05ODI1LTY0ODRhY2ViNDljNSIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6ImE3YTFhZTFiLWQ5NzUtNGFiNS1hNTVkLWEwMzMwZTcyMjVjZiIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBJbnN0YW50aWF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCIsIkdFVCJdLCJyc2lkIjoiYjgwMGM3ZWMtYjY4YS00OTM4LTgwNmItZjU1NjU5M2EyZGUzIiwicnNuYW1lIjoiRS1WTkZNIFBhY2thZ2VzIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiYjZhOWI0NDMtNTUzZi00OTM3LWE2ZjEtMDgxODA3ZjNlNDY2IiwicnNuYW1lIjoiRS1WTkZNIE1hbnVhbCBSb2xsYmFjayBPcGVyYXRpb24ifSx7InNjb3BlcyI6WyJQT1NUIl0sInJzaWQiOiJiNmE5YjQ0My01NTNmLTQ5MzctYTZmMS0wODE4MDdmM2U2NDciLCJyc25hbWUiOiJFLVZORk0gTWFudWFsIEZhaWwgT3BlcmF0aW9uIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiYjZhOWI0NDMtNTUzZi00OTM3LWE2ZjEtMDgxODA3ZjNlNDY1IiwicnNuYW1lIjoiRS1WTkZNIE1hbnVhbCBIZWFsIFJlc291cmNlIn0seyJzY29wZXMiOlsiUFVUIl0sInJzaWQiOiI3ZWU4ZTM1ZC00NjI0LTQ1M2YtYjIwMC1kNTliNWE3ZjM5NzgiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBPbmJvYXJkaW5nIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCIsIkdFVCJdLCJyc2lkIjoiYjk5MTdkM2MtMmIzNy00NjNiLWJmMTQtYWQxYTUxODFjMGFmIiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlcyBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6ImJkNjc2ZjQ0LWNhOWUtNDNlYS1hOGRhLTg0MTQwOTFiN2I2ZiIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBUZXJtaW5hdGlvbiBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIkdFVCJdLCJyc2lkIjoiYzA4YzE5YzItY2M5Zi00NDg2LTlmYmMtODcwMjdjOTQwNDYzIiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlIEluZm9ybWF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiJjMDhjMTljMi1jYzlmLTQ0ODYtOWZiYy04NzAyMWM5NDA0NjMiLCJyc25hbWUiOiJFLVZORk0gUmVzb3VyY2UgRG93bmdyYWRlSW5mbyBSZXNvdXJjZSJ9LHsicnNpZCI6ImNiYzFhY2ZjLTg3NDUtNDRkNi04ZGQ2LTVkOTczYzY5YjFhZCIsInJzbmFtZSI6IkRlZmF1bHQgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJHRVQiXSwicnNpZCI6ImVlOTMzMjFmLTI0YjAtNDc1NC1iODFjLTRkNDYxODUxYzAyNyIsInJzbmFtZSI6IkUtVk5GTSBJbWFnZXMgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIiwiR0VUIiwiREVMRVRFIiwiUFVUIiwiUEFUQ0giXSwicnNpZCI6ImZhYzhjZGIwLTc0NTYtNDlmOC1hMDdlLTgzMjg4ODBiMjM3MyIsInJzbmFtZSI6IkUtVk5GTSBDbHVzdGVyIENvbmZpZ3VyYXRpb24gUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIiwiR0VUIiwiREVMRVRFIl0sInJzaWQiOiJjMDhxMjljMi1jYzlmLTU3ODYtOWZiYy04NzAyMWM5MTA0NjMiLCJyc25hbWUiOiJFLVZORk0gQmFja3VwIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiI5NTUwYWUyZS00Y2IzLTQwZmYtODVjNC01MGQxNWYzZDBiNmMiLCJyc25hbWUiOiJFLVZORk0gQmFja3VwIFNjb3BlcyBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6IjY2YjA3YWRlLWEyYTUtNGFkMi04NTZmLWU4MDc5OTAzODhmNCIsInJzbmFtZSI6IkUtVk5GTSBTeW5jcm9uaXplIFJlc291cmNlIn1dfSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiJ9.v5mYZf53IUaFJaXarM8bM3BLqfxj_Ef1msNCGx5vsnk",
      expires_in: 60,
      refresh_expires_in: 1800,
      refresh_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZjM1NmRlOS03MTIxLTQ3NTItYTFiYi0wNjQyZDAwMjQzM2QiLCJleHAiOjI1NzEyMzQyMTIsIm5iZiI6MCwiaWF0IjoyNTcxMjM0MTUyLCJpc3MiOiJodHRwczovL2tleWNsb2FrLmhtLW1hbnVhbC10ZXN0LTEudG9kZDA0MS5ybmQuZ2ljLmVyaWNzc29uLnNlL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6InZuZm0iLCJzdWIiOiJhMjViYWFjOC1hMzhhLTQxNTQtYjFlOC1hY2RmNWQzMDczNjUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ2bmZtIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNzFlNTU2ZWEtOWMzYi00NTkyLTgzNTgtNDhkNmQ4N2UzNGFjIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2V2bmZtLmhtLW1hbnVhbC10ZXN0LTEudG9kZDA0MS5ybmQuZ2ljLmVyaWNzc29uLnNlIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJjcmVhdGUtcmVhbG0iLCJFLVZORk0gVXNlciBSb2xlIiwiVXNlckFkbWluIiwiRS1WTkZNIFJlYWQtb25seSBVc2VyIFJvbGUiLCJvZmZsaW5lX2FjY2VzcyIsIkUtVk5GTSBBRFAgQ0kgRmxvdyBSb2xlIiwiRS1WTkZNIFN1cGVyIFVzZXIgUm9sZSIsIkUtVk5GTSBVSSBVc2VyIFJvbGUiLCJhZG1pbiIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibWFzdGVyLXJlYWxtIjp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJhdXRob3JpemF0aW9uIjp7InBlcm1pc3Npb25zIjpbeyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMDk4ODMwZTMtODRhNy00YWQ5LTk2YzgtMmEwN2IyYTljMDg4IiwicnNuYW1lIjoiRS1WTkZNIEVOTSBOb2RlIERlbGV0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMTE4OTYyYzItYWJhNS00MTE4LWJhZjUtYTgzZGRmODFhZDQ5IiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlIFVwZ3JhZGUgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIl0sInJzaWQiOiIxMTg5NjJjMi1hYmE1LTQxMTgtYmFmNS1hODNkZGY4MWFkNTkiLCJyc25hbWUiOiJFLVZORk0gTWFudWFsIFNjYWxlIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiIxZmQ0M2Q1MS02ZWExLTQwNjQtYWVkZS00NDJhNDgyNjk4NjMiLCJyc25hbWUiOiJFLVZORk0gQ2hhcnRzIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiMjc5MjdjOTctNWFjNS00M2U1LWFjYTAtZWQxN2QwYWQzZjBmIiwicnNuYW1lIjoiRS1WTkZNIEVOTSBOb2RlIEludGVncmF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUFVUIl0sInJzaWQiOiIzMWYwZmY1ZC1jN2ZmLTQxMDAtYTI2MC1lN2FjM2MxYWI3NTYiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBPbmJvYXJkaW5nIFJlc291cmNlIn0seyJzY29wZXMiOlsiREVMRVRFIiwiUE9TVCIsIkdFVCIsIlBBVENIIiwiUFVUIl0sInJzaWQiOiIzMzMxYmYxNy0wNTQwLTQ3NTEtYjdjMi1mZmM2MjAzNjI4NDEiLCJyc25hbWUiOiJVc2VycyJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6IjRkZDZjODY1LWY5ZWEtNDNiNi05ZTIzLTk5NjI2YmJlNDM4OSIsInJzbmFtZSI6IkUtVk5GTSBJbnRlcm5hbCBQYWNrYWdlIE9uYm9hcmRpbmcgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJERUxFVEUiLCJHRVQiXSwicnNpZCI6IjgxNzcxOTE3LTg3YjUtNDVhOS1hOTk3LTVjNTJiNWE5MDZiYiIsInJzbmFtZSI6IkUtVk5GTSBQYWNrYWdlIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiI5YTk4OTIxYi05ODc1LTQ0MTctOTZkMS00OTlkNzY0YzBiOTgiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBJbmZvcm1hdGlvbiBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIkdFVCJdLCJyc2lkIjoiYTBhMjU3MWItMDhlNC00ZjQwLTg4NWUtMzI2MWY4ZjEwY2EwIiwicnNuYW1lIjoiRS1WTkZNIE9wZXJhdGlvbiBIaXN0b3J5IFJlc291cmNlIn0seyJzY29wZXMiOlsiREVMRVRFIiwiR0VUIiwiUEFUQ0giXSwicnNpZCI6ImE3Mjg1OTlhLWUwNjYtNGE5OC05ODI1LTY0ODRhY2ViNDljNSIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6ImE3YTFhZTFiLWQ5NzUtNGFiNS1hNTVkLWEwMzMwZTcyMjVjZiIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBJbnN0YW50aWF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCIsIkdFVCJdLCJyc2lkIjoiYjgwMGM3ZWMtYjY4YS00OTM4LTgwNmItZjU1NjU5M2EyZGUzIiwicnNuYW1lIjoiRS1WTkZNIFBhY2thZ2VzIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiYjZhOWI0NDMtNTUzZi00OTM3LWE2ZjEtMDgxODA3ZjNlNDY2IiwicnNuYW1lIjoiRS1WTkZNIE1hbnVhbCBSb2xsYmFjayBPcGVyYXRpb24ifSx7InNjb3BlcyI6WyJQT1NUIl0sInJzaWQiOiJiNmE5YjQ0My01NTNmLTQ5MzctYTZmMS0wODE4MDdmM2U2NDciLCJyc25hbWUiOiJFLVZORk0gTWFudWFsIEZhaWwgT3BlcmF0aW9uIn0seyJzY29wZXMiOlsiUE9TVCJdLCJyc2lkIjoiYjZhOWI0NDMtNTUzZi00OTM3LWE2ZjEtMDgxODA3ZjNlNDY1IiwicnNuYW1lIjoiRS1WTkZNIE1hbnVhbCBIZWFsIFJlc291cmNlIn0seyJzY29wZXMiOlsiUFVUIl0sInJzaWQiOiI3ZWU4ZTM1ZC00NjI0LTQ1M2YtYjIwMC1kNTliNWE3ZjM5NzgiLCJyc25hbWUiOiJFLVZORk0gUGFja2FnZSBPbmJvYXJkaW5nIFJlc291cmNlIn0seyJzY29wZXMiOlsiUE9TVCIsIkdFVCJdLCJyc2lkIjoiYjk5MTdkM2MtMmIzNy00NjNiLWJmMTQtYWQxYTUxODFjMGFmIiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlcyBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6ImJkNjc2ZjQ0LWNhOWUtNDNlYS1hOGRhLTg0MTQwOTFiN2I2ZiIsInJzbmFtZSI6IkUtVk5GTSBSZXNvdXJjZSBUZXJtaW5hdGlvbiBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIkdFVCJdLCJyc2lkIjoiYzA4YzE5YzItY2M5Zi00NDg2LTlmYmMtODcwMjdjOTQwNDYzIiwicnNuYW1lIjoiRS1WTkZNIFJlc291cmNlIEluZm9ybWF0aW9uIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiJjMDhjMTljMi1jYzlmLTQ0ODYtOWZiYy04NzAyMWM5NDA0NjMiLCJyc25hbWUiOiJFLVZORk0gUmVzb3VyY2UgRG93bmdyYWRlSW5mbyBSZXNvdXJjZSJ9LHsicnNpZCI6ImNiYzFhY2ZjLTg3NDUtNDRkNi04ZGQ2LTVkOTczYzY5YjFhZCIsInJzbmFtZSI6IkRlZmF1bHQgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJHRVQiXSwicnNpZCI6ImVlOTMzMjFmLTI0YjAtNDc1NC1iODFjLTRkNDYxODUxYzAyNyIsInJzbmFtZSI6IkUtVk5GTSBJbWFnZXMgUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIiwiR0VUIiwiREVMRVRFIiwiUFVUIiwiUEFUQ0giXSwicnNpZCI6ImZhYzhjZGIwLTc0NTYtNDlmOC1hMDdlLTgzMjg4ODBiMjM3MyIsInJzbmFtZSI6IkUtVk5GTSBDbHVzdGVyIENvbmZpZ3VyYXRpb24gUmVzb3VyY2UifSx7InNjb3BlcyI6WyJQT1NUIiwiR0VUIiwiREVMRVRFIl0sInJzaWQiOiJjMDhxMjljMi1jYzlmLTU3ODYtOWZiYy04NzAyMWM5MTA0NjMiLCJyc25hbWUiOiJFLVZORk0gQmFja3VwIFJlc291cmNlIn0seyJzY29wZXMiOlsiR0VUIl0sInJzaWQiOiI5NTUwYWUyZS00Y2IzLTQwZmYtODVjNC01MGQxNWYzZDBiNmMiLCJyc25hbWUiOiJFLVZORk0gQmFja3VwIFNjb3BlcyBSZXNvdXJjZSJ9LHsic2NvcGVzIjpbIlBPU1QiXSwicnNpZCI6IjY2YjA3YWRlLWEyYTUtNGFkMi04NTZmLWU4MDc5OTAzODhmNCIsInJzbmFtZSI6IkUtVk5GTSBTeW5jcm9uaXplIFJlc291cmNlIn1dfSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiJ9.v5mYZf53IUaFJaXarM8bM3BLqfxj_Ef1msNCGx5vsnk",
      token_type: "Bearer",
      "not-before-policy": 0
    };

    res.status(202).send(token);
  });

  app.use(
    "/vnfm/container",
    proxy("localhost:8080", {
      proxyReqOptDecorator: function(proxyReqOpts) {
        proxyReqOpts.port = "10101";
        return proxyReqOpts;
      }
    })
  );

  /**
   * components
   */
  app.use(
    "/components/logo",
    express.static(
      path.join(__dirname, "../node_modules/@eui/container/target/package/components/logo")
    )
  );
  app.use(
    "/components/user-display",
    express.static(
      path.join(__dirname, "../node_modules/@eui/container/target/package/components/user-display")
    )
  );

  /**
   * panels
   */
  app.use(
    "/panels/menu-panel",
    express.static(
      path.join(__dirname, "../node_modules/@eui/container/target/package/panels/menu-panel")
    )
  );
  app.use(
    "/panels/user-settings-panel",
    express.static(
      path.join(
        __dirname,
        "../node_modules/@eui/container/target/package/panels/user-settings-panel"
      )
    )
  );

  /**
   * libs
   */
  app.use(
    "/libs/system.js",
    express.static(
      path.join(__dirname, "../node_modules/@eui/container/target/package/libs/system.js")
    )
  );
  app.use(
    "/libs/@eui",
    express.static(path.join(__dirname, "../node_modules/@eui/container/target/package/libs/@eui"))
  );

  /**
   * assets
   */
  app.use(
    "/assets/fonts",
    express.static(
      path.join(__dirname, "../node_modules/@eui/theme/target/package/@eui/theme/0/fonts")
    )
  );
  app.use(
    "/assets/css",
    express.static(path.join(__dirname, "../node_modules/@eui/container/target/package/assets/css"))
  );
  app.use(
    "/assets/icons",
    express.static(
      path.join(__dirname, "../node_modules/@eui/container/target/package/assets/icons")
    )
  );
  app.use(
    "/assets/img",
    express.static(path.join(__dirname, "../node_modules/@eui/container/target/package/assets/img"))
  );
  app.use(
    "/assets/favicon.ico",
    express.static(
      path.join(__dirname, "../node_modules/@eui/container/target/package/assets/favicon.ico")
    )
  );
  app.use(
    "/assets/warning_icon.svg",
    express.static(
      path.join(__dirname, "../node_modules/@eui/container/target/package/assets/warning_icon.svg")
    )
  );

  app.use(
    "/components/base-filter-panel/0/config.json",
    express.static(path.join(__dirname, "../client/components/base-filter-panel/config.json"))
  );

  app.use(
    "/components/packages-filter-panel/0/config.json",
    express.static(path.join(__dirname, "../client/components/packages-filter-panel/config.json"))
  );

  app.use(
    "/components/resource-filter-panel/0/config.json",
    express.static(path.join(__dirname, "../client/components/resource-filter-panel/config.json"))
  );

  app.use(
    "/components/operations-filter-panel/0/config.json",
    express.static(path.join(__dirname, "../client/components/operations-filter-panel/config.json"))
  );

  app.use(
    "/components/generic-dialog/0/config.json",
    express.static(path.join(__dirname, "../client/components/generic-dialog/config.json"))
  );
  app.use(
    "/components/upgrade-wizard-component/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/upgrade-wizard-component/config.json")
    )
  );

  app.use(
    "/components/operations-details-panel/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/operations-details-panel/config.json")
    )
  );
  /**
   * polyfills
   */
  app.use(
    "/polyfills/webcomponents-lite.js",
    express.static(
      path.join(
        __dirname,
        "../node_modules/@eui/container/target/package/polyfills/webcomponents-lite.js"
      )
    )
  );

  app.use(
    "/components/operations-history-list/0/config.json",
    express.static(path.join(__dirname, "../client/components/operations-history-list/config.json"))
  );

  app.use(
    "/components/resource-operations-details/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/resource-operations-details/config.json")
    )
  );

  app.use(
    "/components/generic-inline-description/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/generic-inline-description/config.json")
    )
  );

  app.use(
    "/components/documentation-system-bar-menu/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/documentation-system-bar-menu/config.json")
    )
  );

  app.use(
    "/components/generic-accordion/0/config.json",
    express.static(path.join(__dirname, "../client/components/generic-accordion/config.json"))
  );

  app.use(
    "/components/file-content-dialog/0/config.json",
    express.static(path.join(__dirname, "../client/components/file-content-dialog/config.json"))
  );

  app.use(
    "/components/file-upload-dialog/0/config.json",
    express.static(path.join(__dirname, "../client/components/file-upload-dialog/config.json"))
  );

  app.use(
    "/components/rollback-dialog/0/config.json",
    express.static(path.join(__dirname, "../client/components/rollback-dialog/config.json"))
  );

  app.use(
    "/components/heal-resource-panel/0/config.json",
    express.static(path.join(__dirname, "../client/components/heal-resource-panel/config.json"))
  );

  app.use(
    "/components/resource-backups-details/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/resource-backups-details/config.json")
    )
  );

  app.use(
    "/components/resource-backups-list/0/config.json",
    express.static(path.join(__dirname, "../client/components/resource-backups-list/config.json"))
  );

  app.use(
    "/components/backup-local-dialog/0/config.json",
    express.static(path.join(__dirname, "../client/components/backup-local-dialog/config.json"))
  );

  app.use(
    "/components/export-backup-dialog/0/config.json",
    express.static(path.join(__dirname, "../client/components/export-backup-dialog/config.json"))
  );

  app.use(
    "/components/version-system-bar-menu/0/config.json",
    express.static(path.join(__dirname, "../client/components/version-system-bar-menu/config.json"))
  );

  app.use(
    "/components/force-fail-dialog/0/config.json",
    express.static(path.join(__dirname, "../client/components/force-fail-dialog/config.json"))
  );

  app.use(
    "/components/generic-key-value-file-text-input/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/generic-key-value-file-text-input/config.json")
    )
  );

  app.use(
    "/components/generic-file-input/0/config.json",
    express.static(path.join(__dirname, "../client/components/generic-file-input/config.json"))
  );

  app.use(
    "/components/generic-key-map-card-group/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/generic-key-map-card-group/config.json")
    )
  );

  app.use(
    "/components/generic-key-map-card/0/config.json",
    express.static(
      path.join(__dirname, "../client/components/generic-key-map-card/config.json")
    )
  );

    app.use(
      "/components/generic-key-value-pair-input/0/config.json",
      express.static(
        path.join(__dirname, "../client/components/generic-key-value-pair-input/config.json")
      )
    );

    app.use(
      "/components/generic-key-value-pair-input-group/0/config.json",
      express.static(
        path.join(__dirname, "../client/components/generic-key-value-pair-input-group/config.json")
      )
    );

  app.use('/components/resource-rollback-panel/0/config.json',
    express.static(path.join(__dirname, '../client/components/resource-rollback-panel/config.json'))
  );

};
