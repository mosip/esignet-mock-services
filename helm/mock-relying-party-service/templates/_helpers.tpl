{{/*
Expand the name of the chart.
*/}}
{{- define "mock-relying-party-service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Return the proper  image name
*/}}
{{- define "mock-relying-party-service.image" -}}
{{ include "common.images.image" (dict "imageRoot" .Values.image "global" .Values.global) }}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "mock-relying-party-service.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Return the proper image name (for the init container volume-permissions image)
*/}}
{{- define "mock-relying-party-service.volumePermissions.image" -}}
{{- include "common.images.image" ( dict "imageRoot" .Values.volumePermissions.image "global" .Values.global ) -}}
{{- end -}}

{{/*
Return the proper Docker Image Registry Secret Names
*/}}
{{- define "mock-relying-party-service.imagePullSecrets" -}}
{{- include "common.images.pullSecrets" (dict "images" (list .Values.image .Values.volumePermissions.image) "global" .Values.global) -}}
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "mock-relying-party-service.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (printf "%s-foo" (include "common.names.fullname" .)) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{/*
Compile all warnings into a single message.
*/}}
{{- define "mock-relying-party-service.validateValues" -}}
{{- $messages := list -}}
{{- $messages := append $messages (include "mock-relying-party-service.validateValues.foo" .) -}}
{{- $messages := append $messages (include "mock-relying-party-service.validateValues.bar" .) -}}
{{- $messages := without $messages "" -}}
{{- $message := join "\n" $messages -}}

{{- if $message -}}
{{-   printf "\nVALUES VALIDATION:\n%s" $message -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "mock-relying-party-service.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "mock-relying-party-service.labels" -}}
helm.sh/chart: {{ include "mock-relying-party-service.chart" . }}
{{ include "mock-relying-party-service.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "mock-relying-party-service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "mock-relying-party-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Return podAnnotations
*/}}
{{- define "mock-relying-party-service.podAnnotations" -}}
{{- if .Values.podAnnotations }}
{{ include "common.tplvalues.render" (dict "value" .Values.podAnnotations "context" $) }}
{{- end }}
{{- if and .Values.metrics.enabled .Values.metrics.podAnnotations }}
{{ include "common.tplvalues.render" (dict "value" .Values.metrics.podAnnotations "context" $) }}
{{- end }}
{{- end -}}