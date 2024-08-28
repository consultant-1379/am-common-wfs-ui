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

ARG BASE_IMAGE_VERSION
FROM armdocker.rnd.ericsson.se/proj-am/sles/sles-corretto-openjdk17:${BASE_IMAGE_VERSION}

ARG GIT_COMMIT=""
ARG APP_VERSION=""
ARG BUILD_TIME=""
# User Id generated based on ADP rule DR-D1123-122 (am-common-wfs-ui : 298250)
ARG uid=298250
ARG gid=298250

RUN echo "${uid}:x:${uid}:${gid}:UI-user:/:/bin/bash" >> /etc/passwd
RUN sed -i '/root/s/bash/false/g' /etc/passwd

LABEL product.number="CXU 101 0675" \
      product.revision="R1A" \
      GIT_COMMIT=$GIT_COMMIT \
      com.ericsson.product-name="CNF LCM UI" \
      com.ericsson.product-number="CXU 101 0675" \
      com.ericsson.product-revision="R1A" \
      org.opencontainers.image.title="CNF LCM UI" \
      org.opencontainers.image.created=${BUILD_TIME} \
      org.opencontainers.image.revision=${GIT_COMMIT} \
      org.opencontainers.image.version=${APP_VERSION} \
      org.opencontainers.image.vendor="Ericsson"

ADD eric-am-common-ui-server/target/eric-am-common-ui-server.jar eric-am-common-ui-server.jar

COPY entryPoint.sh /entryPoint.sh

RUN sh -c 'touch /eric-am-common-ui-server.jar' && chmod 755 /entryPoint.sh

USER ${uid}:${gid}

ENTRYPOINT ["/entryPoint.sh"]

EXPOSE 8080
