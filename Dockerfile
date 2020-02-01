FROM node:12.4
EXPOSE 8888

WORKDIR /usr/src/smart-brain-api

COPY ./ ./

RUN npm install 

# state of the container of the run command will be committed to the docker image

CMD ["/bin/bash"]
#CMD executes by default when you launch the build image. Docker file can only have one CMD, which is usually at the end of the file.