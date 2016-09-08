#!/usr/bin/env bash
# An inventory script to load the inventory from JSON file.
#

if [ -z "$JSON_INVENTORY_FILE" ]; then
   echo "JSON_INVENTORY_FILE not specified"
   exit 1
fi

cat $JSON_INVENTORY_FILE
