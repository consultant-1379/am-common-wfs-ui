{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "eric-am-common-wfs-ui.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "eric-am-common-wfs-ui.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- template "eric-am-common-wfs-ui.name" . -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "eric-am-common-wfs-ui.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create main image registry url
*/}}
{{- define "eric-am-common-wfs-ui.mainImagePath" -}}
  {{- include "eric-eo-evnfm-library-chart.mainImagePath" (dict "ctx" . "svcRegistryName" "wfsUIService") -}}
{{- end -}}

{{/*
Create Ericsson Product Info
*/}}
{{- define "eric-am-common-wfs-ui.helm-annotations" -}}
{{- include "eric-eo-evnfm-library-chart.helm-annotations" . -}}
{{- end}}

{{/*
Create prometheus info
*/}}
{{- define "eric-am-common-wfs-ui.prometheus" -}}
  {{- include "eric-eo-evnfm-library-chart.prometheus" . }}
{{- end -}}

{{/*
Create Ericsson product app.kubernetes.io info
*/}}
{{- define "eric-am-common-wfs-ui.kubernetes-io-info" -}}
  {{- include "eric-eo-evnfm-library-chart.kubernetes-io-info" . -}}
{{- end -}}

{{/*
Create image pull secrets
*/}}
{{- define "eric-am-common-wfs-ui.pullSecrets" -}}
  {{- include "eric-eo-evnfm-library-chart.pullSecrets" . -}}
{{- end -}}

{{/*
Create label for ADP GUI Aggregator
*/}}
{{- define "eric-am-common-wfs-ui-aggregator" -}}
{{ .Values.k8sLabelPropertyName }}: {{ .Values.k8sLabelPropertyValue }}
{{- end -}}

{{/*
Create annotation for ADP GUI Aggregator
*/}}
{{- define "eric-am-common-wfs-ui.gui-aggregator-app-ingress" -}}
ui.ericsson.com/external-baseurl: https://{{ .Values.global.hosts.vnfm }}
{{- end -}}

{{/*
Create pullPolicy for ui service container
*/}}
{{- define "eric-am-common-wfs-ui.imagePullPolicy" -}}
  {{- include "eric-eo-evnfm-library-chart.imagePullPolicy" (dict "ctx" . "svcRegistryName" "wfsUIService") -}}
{{- end -}}

{{/*
The name of the cluster role used during openshift deployments.
This helper is provided to allow use of the new global.security.privilegedPolicyClusterRoleName if set, otherwise
use the previous naming convention of <name>-allowed-use-privileged-policy for backwards compatibility.
*/}}
{{- define "eric-am-common-wfs-ui.privileged.cluster.role.name" -}}
  {{- include "eric-eo-evnfm-library-chart.privileged.cluster.role.name" ( dict "ctx" . "svcName" (include "eric-am-common-wfs-ui.name" .) ) -}}
{{- end -}}

{{- define "eric-am-common-wfs-ui.nodeSelector" -}}
  {{- include "eric-eo-evnfm-library-chart.nodeSelector" . -}}
{{- end -}}

{{/*
Create chart version as used by the chart label.
*/}}
{{- define "eric-am-common-wfs-ui.version" -}}
  {{- printf "%s" .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "eric-am-common-wfs-ui.labels" -}}
  {{- $kubernetesLabels := include "eric-am-common-wfs-ui.kubernetes-io-info" . | fromYaml -}}
  {{- $globalLabels := (.Values.global).labels -}}
  {{- $serviceLabels := .Values.labels -}}
  {{- include "eric-eo-evnfm-library-chart.mergeLabels" (dict "location" .Template.Name "sources" (list $kubernetesLabels $globalLabels $serviceLabels)) }}
{{- end -}}

{{/*
Merged labels for extended defaults
*/}}
{{- define "eric-am-common-wfs-ui.labels.extended-defaults" -}}
  {{- $extendedLabels := dict -}}
  {{- $_ := set $extendedLabels "logger-communication-type" "direct" -}}
  {{- $_ := set $extendedLabels "app" (include "eric-am-common-wfs-ui.name" .) -}}
  {{- $_ := set $extendedLabels "chart" (include "eric-am-common-wfs-ui.chart" .) -}}
  {{- $_ := set $extendedLabels "release" (.Release.Name) -}}
  {{- $_ := set $extendedLabels "heritage" (.Release.Service) -}}
  {{- $commonLabels := include "eric-am-common-wfs-ui.labels" . | fromYaml -}}
  {{- include "eric-eo-evnfm-library-chart.mergeLabels" (dict "location" .Template.Name "sources" (list $commonLabels $extendedLabels)) | trim }}
{{- end -}}

{{/*
Create Ericsson product specific annotations
*/}}
{{- define "eric-am-common-wfs-ui.helm-annotations_product_name" -}}
  {{- include "eric-eo-evnfm-library-chart.helm-annotations_product_name" . -}}
{{- end -}}
{{- define "eric-am-common-wfs-ui.helm-annotations_product_number" -}}
  {{- include "eric-eo-evnfm-library-chart.helm-annotations_product_number" . -}}
{{- end -}}
{{- define "eric-am-common-wfs-ui.helm-annotations_product_revision" -}}
  {{- include "eric-eo-evnfm-library-chart.helm-annotations_product_revision" . -}}
{{- end -}}

{{/*
Create a dict of annotations for the product information (DR-D1121-064, DR-D1121-067).
*/}}
{{- define "eric-am-common-wfs-ui.product-info" }}
ericsson.com/product-name: {{ template "eric-am-common-wfs-ui.helm-annotations_product_name" . }}
ericsson.com/product-number: {{ template "eric-am-common-wfs-ui.helm-annotations_product_number" . }}
ericsson.com/product-revision: {{ template "eric-am-common-wfs-ui.helm-annotations_product_revision" . }}
{{- end }}

{{/*
Common annotations
*/}}
{{- define "eric-am-common-wfs-ui.annotations" -}}
  {{- $productInfo := include "eric-am-common-wfs-ui.product-info" . | fromYaml -}}
  {{- $globalAnn := (.Values.global).annotations -}}
  {{- $serviceAnn := .Values.annotations -}}
  {{- include "eric-eo-evnfm-library-chart.mergeAnnotations" (dict "location" .Template.Name "sources" (list $productInfo $globalAnn $serviceAnn)) | trim }}
{{- end -}}

{{/*
Define probes
*/}}
{{- define "eric-am-common-wfs-ui.probes" -}}
{{- $default := .Values.probes -}}
{{- if .Values.probing }}
  {{- if .Values.probing.liveness }}
    {{- if .Values.probing.liveness.commonwfsui }}
      {{- $default := mergeOverwrite $default.commonwfsui.livenessProbe .Values.probing.liveness.commonwfsui  -}}
    {{- end }}
  {{- end }}
  {{- if .Values.probing.readiness }}
    {{- if .Values.probing.readiness.commonwfsui }}
      {{- $default := mergeOverwrite $default.commonwfsui.readinessProbe .Values.probing.readiness.commonwfsui  -}}
    {{- end }}
  {{- end }}
{{- end }}
{{- $default | toJson -}}
{{- end -}}

{{/*
To support Dual stack.
*/}}
{{- define "eric-am-common-wfs-ui.internalIPFamily" -}}
  {{- include "eric-eo-evnfm-library-chart.internalIPFamily" . -}}
{{- end -}}

{{- define "eric-am-common-wfs-ui.podPriority" -}}
  {{- include "eric-eo-evnfm-library-chart.podPriority" ( dict "ctx" . "svcName" "commonwfsui" ) -}}
{{- end -}}

{{/*
Define tolerations property
*/}}
{{- define "eric-am-common-wfs-ui.tolerations.commonwfsui" -}}
  {{- include "eric-eo-evnfm-library-chart.merge-tolerations" (dict "root" . "podbasename" "commonwfsui" ) -}}
{{- end -}}

{{/*
Check global.security.tls.enabled
*/}}
{{- define "eric-am-common-wfs-ui.global-security-tls-enabled" -}}
  {{- include "eric-eo-evnfm-library-chart.global-security-tls-enabled" . -}}
{{- end -}}

{{/*
DR-D470217-007-AD This helper defines whether this service enter the Service Mesh or not.
*/}}
{{- define "eric-am-common-wfs-ui.service-mesh-enabled" }}
  {{- include "eric-eo-evnfm-library-chart.service-mesh-enabled" . -}}
{{- end -}}

{{/*
DR-D470217-011 This helper defines the annotation which bring the service into the mesh.
*/}}
{{- define "eric-am-common-wfs-ui.service-mesh-inject" }}
  {{- include "eric-eo-evnfm-library-chart.service-mesh-inject" . -}}
{{- end -}}

{{/*
GL-D470217-080-AD
This helper captures the service mesh version from the integration chart to
annotate the workloads so they are redeployed in case of service mesh upgrade.
*/}}
{{- define "eric-am-common-wfs-ui.service-mesh-version" }}
  {{- include "eric-eo-evnfm-library-chart.service-mesh-version" . -}}
{{- end -}}

{{/*
This helper defines log level for Service Mesh.
*/}}
{{- define "eric-am-common-wfs-ui.service-mesh-logs" }}
  {{- include "eric-eo-evnfm-library-chart.service-mesh-logs" . -}}
{{- end -}}

{{/*
DR-D1123-124
Evaluating the Security Policy Cluster Role Name
*/}}
{{- define "eric-am-common-wfs-ui.securityPolicy.reference" -}}
  {{- include "eric-eo-evnfm-library-chart.securityPolicy.reference" . -}}
{{- end -}}

{{/*
Create fsGroup Values DR-1123-136
*/}}
{{- define "eric-am-common-wfs-ui.fsGroup" -}}
{{- include "eric-eo-evnfm-library-chart.fsGroup" . -}}
{{- end -}}

{{/*
DR-D470222-010
Configuration of Log Collection Streaming Method
*/}}
{{- define "eric-am-common-wfs-ui.log.streamingMethod" -}}
{{- include "eric-eo-evnfm-library-chart.log.streamingMethod" . -}}
{{- end }}

{{/*
DR-D1123-134
Generation of role bindings for admission control in OpenShift environment
*/}}
{{- define "eric-am-common-wfs-ui.service-account.name" -}}
    {{- printf "%s-sa" (include "eric-am-common-wfs-ui.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
DR-D1123-134
Rolekind parameter for generation of role bindings for admission control in OpenShift environment
*/}}
{{- define "eric-am-common-wfs-ui.securityPolicy.rolekind" }}
  {{- include "eric-eo-evnfm-library-chart.securityPolicy.rolekind" . }}
{{- end }}

{{/*
DR-D1123-134
Rolename parameter for generation of role bindings for admission control in OpenShift environment
*/}}
{{- define "eric-am-common-wfs-ui.securityPolicy.rolename" }}
  {{- include "eric-eo-evnfm-library-chart.securityPolicy.rolename" . }}
{{- end }}

{{/*
DR-D1123-134
RoleBinding name for generation of role bindings for admission control in OpenShift environment
*/}}
{{- define "eric-am-common-wfs-ui.securityPolicy.rolebinding.name" }}
  {{- include "eric-eo-evnfm-library-chart.securityPolicy.rolebinding.name" . }}
{{- end }}