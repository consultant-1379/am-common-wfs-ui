{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}



{{/*
Create Ericsson product app.kubernetes.io info
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.kubernetes-io-info" -}}
app.kubernetes.io/name: {{ .Chart.Name | quote }}
app.kubernetes.io/version: {{ .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" | quote }}
app.kubernetes.io/instance: {{ .Release.Name | quote }}
{{- end -}}

{{/*
Create Ericsson Product Info
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.helm-annotations" -}}
ericsson.com/product-name: "E-VNFM Backend Stub"
ericsson.com/product-number: "Unknown"
ericsson.com/product-revision: "R1A"
{{- end}}

{{/*
Create image registry url
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.registryUrl" -}}
  {{ if index .Values "imageCredentials" "eric-am-common-wfs-ui-dev-backend" "registry" "url" -}}
    {{- print (index .Values "imageCredentials" "eric-am-common-wfs-ui-dev-backend" "registry" "url") -}}
  {{- else -}}
    {{- print .Values.global.registry.url -}}
  {{- end -}}
{{- end -}}

{{/*
Create keycloak-client image registry url
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.keycloak-client.registryUrl" -}}
  {{ if index .Values "imageCredentials" "keycloak-client" "registry" "url" -}}
    {{- print (index .Values "imageCredentials" "keycloak-client" "registry" "url") -}}
  {{- else -}}
    {{- print .Values.global.registry.url -}}
  {{- end -}}
{{- end -}}

{{/*

Create keycloak client config image pull secrets
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.keycloak-client.pullSecrets" -}}
  {{- if .Values.imageCredentials.pullSecret -}}
    {{- print .Values.imageCredentials.pullSecret -}}
  {{- else if .Values.global.pullSecret -}}
    {{- print .Values.global.pullSecret -}}
  {{ else if index .Values "imageCredentials" "eric-am-common-wfs-ui-dev-backend" "registry" "pullSecret" -}}
    {{- print (index .Values "imageCredentials" "eric-am-common-wfs-ui-dev-backend" "registry" "pullSecret") -}}
  {{- else if .Values.global.registry.pullSecret -}}
    {{- print .Values.global.registry.pullSecret -}}
  {{- end -}}
{{- end -}}

{{/*
Create pullPolicy for dev backend service container
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.imagePullPolicy" -}}
    {{- if .Values.imageCredentials.registry -}}
        {{- if .Values.imageCredentials.registry.imagePullPolicy -}}
            {{- print .Values.imageCredentials.registry.imagePullPolicy -}}
        {{- end -}}
    {{- else if .Values.imageCredentials.pullPolicy -}}
        {{- print .Values.imageCredentials.pullPolicy -}}
    {{- else if .Values.global.registry.imagePullPolicy -}}
        {{- print .Values.global.registry.imagePullPolicy -}}
    {{- end -}}
{{- end -}}

{{- define "eric-am-common-wfs-ui-dev-backend.nodeSelector" -}}
  {{- $nodeSelector := dict -}}
  {{- if .Values.global -}}
    {{- if not (empty .Values.global.nodeSelector) -}}
      {{- mergeOverwrite $nodeSelector .Values.global.nodeSelector | toJson -}}
    {{- else -}}
      {{- $nodeSelector | toJson -}}
    {{- end -}}
  {{- else -}}
    {{- $nodeSelector | toJson -}}
  {{- end -}}
{{- end -}}

{{/*
Create chart version as used by the chart label.
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.version" -}}
{{- printf "%s" .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Kubernetes labels
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.kubernetes-labels" -}}
app.kubernetes.io/name: {{ include "eric-am-common-wfs-ui-dev-backend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name | quote }}
app.kubernetes.io/version: {{ include "eric-am-common-wfs-ui-dev-backend.version" . }}
{{- end -}}


{{/*
Common labels
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.labels" -}}
  {{- $kubernetesLabels := include "eric-am-common-wfs-ui-dev-backend.kubernetes-labels" . | fromYaml -}}
  {{- $globalLabels := (.Values.global).labels -}}
  {{- $serviceLabels := .Values.labels -}}
  {{- include "eric-am-common-wfs-ui-dev-backend.mergeLabels" (dict "location" .Template.Name "sources" (list $kubernetesLabels $globalLabels $serviceLabels)) }}
{{- end -}}

{{/*
Merged labels for extended defaults
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.labels.extended-defaults" -}}
  {{- $extendedLabels := dict -}}
  {{- $_ := set $extendedLabels "app" (include "eric-am-common-wfs-ui-dev-backend.name" .) -}}
  {{- $_ := set $extendedLabels "chart" (include "eric-am-common-wfs-ui-dev-backend.chart" .) -}}
  {{- $_ := set $extendedLabels "release" (.Release.Name) -}}
  {{- $_ := set $extendedLabels "heritage" (.Release.Service) -}}
  {{- $commonLabels := include "eric-am-common-wfs-ui-dev-backend.labels" . | fromYaml -}}
  {{- include "eric-am-common-wfs-ui-dev-backend.mergeLabels" (dict "location" .Template.Name "sources" (list $commonLabels $extendedLabels)) | trim }}
{{- end -}}

{{/*
Create Ericsson product specific annotations
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.helm-annotations_product_name" -}}
{{- $productname := (fromYaml (.Files.Get "eric-product-info.yaml")).productName -}}
{{- print $productname | quote }}
{{- end -}}
{{- define "eric-am-common-wfs-ui-dev-backend.helm-annotations_product_number" -}}
{{- $productNumber := (fromYaml (.Files.Get "eric-product-info.yaml")).productNumber -}}
{{- print $productNumber | quote }}
{{- end -}}
{{- define "eric-am-common-wfs-ui-dev-backend.helm-annotations_product_revision" -}}
{{- $ddbMajorVersion := mustRegexFind "^([0-9]+)\\.([0-9]+)\\.([0-9]+)((-|\\+)EP[0-9]+)*((-|\\+)[0-9]+)*" .Chart.Version -}}
{{- print $ddbMajorVersion | quote }}
{{- end -}}

{{/*
Create a dict of annotations for the product information (DR-D1121-064, DR-D1121-067).
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.product-info" }}
ericsson.com/product-name: {{ template "eric-am-common-wfs-ui-dev-backend.helm-annotations_product_name" . }}
ericsson.com/product-number: {{ template "eric-am-common-wfs-ui-dev-backend.helm-annotations_product_number" . }}
ericsson.com/product-revision: {{ template "eric-am-common-wfs-ui-dev-backend.helm-annotations_product_revision" . }}
{{- end }}

{{/*
Common annotations
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.annotations" -}}
  {{- $productInfo := include "eric-am-common-wfs-ui-dev-backend.product-info" . | fromYaml -}}
  {{- $globalAnn := (.Values.global).annotations -}}
  {{- $serviceAnn := .Values.annotations -}}
  {{- include "eric-am-common-wfs-ui-dev-backend.mergeAnnotations" (dict "location" .Template.Name "sources" (list $productInfo $globalAnn $serviceAnn)) | trim }}
{{- end -}}

{{/*
check global.security.tls.enabled
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.global-security-tls-enabled" -}}
{{- if  .Values.global -}}
  {{- if  .Values.global.security -}}
    {{- if  .Values.global.security.tls -}}
      {{- .Values.global.security.tls.enabled | toString -}}
    {{- else -}}
      {{- "false" -}}
    {{- end -}}
  {{- else -}}
    {{- "false" -}}
  {{- end -}}
{{- else -}}
  {{- "false" -}}
{{- end -}}
{{- end -}}

{{/*
DR-D470217-007-AD This helper defines whether this service enter the Service Mesh or not.
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.service-mesh-enabled" }}
  {{- $globalMeshEnabled := "false" -}}
  {{- if .Values.global -}}
    {{- if .Values.global.serviceMesh -}}
        {{- $globalMeshEnabled = .Values.global.serviceMesh.enabled -}}
    {{- end -}}
  {{- end -}}
  {{- $globalMeshEnabled -}}
{{- end -}}


{{/*
DR-D470217-011 This helper defines the annotation which bring the service into the mesh.
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.service-mesh-inject" }}
{{- if eq (include "eric-am-common-wfs-ui-dev-backend.service-mesh-enabled" .) "true" }}
sidecar.istio.io/inject: "true"
{{- else -}}
sidecar.istio.io/inject: "false"
{{- end -}}
{{- end -}}

{{/*
GL-D470217-080-AD
This helper captures the service mesh version from the integration chart to
annotate the workloads so they are redeployed in case of service mesh upgrade.
*/}}
{{- define "eric-am-common-wfs-ui-dev-backend.service-mesh-version" }}
{{- if eq (include "eric-am-common-wfs-ui-dev-backend.service-mesh-enabled" .) "true" }}
  {{- if .Values.global.serviceMesh -}}
    {{- if .Values.global.serviceMesh.annotations -}}
      {{ .Values.global.serviceMesh.annotations | toYaml }}
    {{- end -}}
  {{- end -}}
{{- end -}}
{{- end -}}
