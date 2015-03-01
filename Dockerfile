FROM fedora

MAINTAINER Simon Le Bras <lebras.simon@gmail.com>

RUN yum install -y node npm

COPY . /src

RUN cd /src; npm install

EXPOSE 3000

CMD ["node", "/src/app.js"]