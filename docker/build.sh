#!/bin/bash
REPO=docker-reg.ecovacs.com/library
CONTAINER=human-machine
DATE=`date +%Y%m%d`
TAG=''

GIT_HASH=$(git rev-parse --short HEAD)
if [ "$GIT_HASH" == "" ]; then
    GIT_HASH="001"
fi

if [ "$TAG" == "" ]; then
    TAG="$DATE-$GIT_HASH"
fi
DOCKER_IMAGE=$REPO/$CONTAINER:$TAG

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILDROOT=$DIR/..

DOCKEERFILE=$DIR/Dockerfile

# Build docker
cmd="docker build -t $DOCKER_IMAGE -f $DOCKEERFILE $BUILDROOT"
echo $cmd
eval $cmd
