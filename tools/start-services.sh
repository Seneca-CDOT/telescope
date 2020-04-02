#!/usr/bin/env bash

set -e
brew services start redis
brew services start elasticsearch-full
