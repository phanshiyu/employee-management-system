# Specify base image
FROM golang:latest

RUN go get -u github.com/cosmtrek/air
RUN go get -u github.com/gin-gonic/gin

# Working directory
WORKDIR /golang-server

# Copy files to container
COPY . .

# Run the watcher
ENTRYPOINT air