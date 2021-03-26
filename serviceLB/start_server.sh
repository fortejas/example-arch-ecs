#!/usr/bin/env bash

gunicorn server:APP -b 0.0.0.0:3000
