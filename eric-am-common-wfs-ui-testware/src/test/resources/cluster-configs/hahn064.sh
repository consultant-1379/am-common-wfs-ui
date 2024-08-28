#
# COPYRIGHT Ericsson 2024
#
#
#
# The copyright to the computer program(s) herein is the property of
#
# Ericsson Inc. The programs may be used and/or copied only with written
#
# permission from Ericsson Inc. or in accordance with the terms and
#
# conditions stipulated in the agreement/contract under which the
#
# program(s) have been supplied.
#

apiVersion: v1
kind: Config
clusters:
- name: "hahn064"
  cluster:
    server: "https://gevalia.rnd.gic.ericsson.se/k8s/clusters/c-lx48g"

users:
- name: "hahn064"
  user:
    token: "kubeconfig-u-ysrp3cckme:rkm95hxz6txdffjjwtvfmnjhjdbbb925n22886wgjvscbd756zd4rq"

contexts:
- name: "hahn064"
  context:
    user: "hahn064"
    cluster: "hahn064"

current-context: "hahn064"
