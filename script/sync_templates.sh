#!/bin/bash
#
# Copies unattended templates from community-templates repository to
# app/views/unattended/ where they can be seeded on new installations.
#
# Not intended for use on existing installations, only for development.
# Production installations should use the foreman_templates plugin to
# update the contents of the database.

REPO=$(mktemp -d)
trap "rm -rf $REPO" EXIT

git clone -q -b $(git symbolic-ref -q HEAD --short) \
  https://github.com/theforeman/community-templates $REPO/ct

# move into destination dir if run from Foreman root
[ -d app/views/foreman_ansible/ ] && cd app/views/foreman_ansible/

rsync -am \
  --include='*ansible*' \
  --exclude='*' \
  $REPO/ct/job_templates/* ./job_templates

cd -

git status -- app/views/foreman_ansible/job_templates
