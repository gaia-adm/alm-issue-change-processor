FROM gaiaadm/result-processing:latest

ARG http_proxy
ARG https_proxy

# Bundle app source
COPY . /src/processors/alm-issue-change-processor

WORKDIR /src/processors/alm-issue-change-processor

RUN npm install

RUN grunt --gruntfile /src/processors/alm-issue-change-processor/Gruntfile.js jshint
