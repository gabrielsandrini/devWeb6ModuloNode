FROM node:13.8.0

RUN apt-get update
RUN apt-get install -y vim
RUN echo "syntax on\ncolorscheme default" > ~/.vimrc
RUN apt-get install python -y
WORKDIR /usr/app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
