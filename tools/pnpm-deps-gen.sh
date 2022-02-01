#!/bin/bash

# First regex can be read as the following:
# .*\.pnpm\/(@?[^@]+).*
# We use the literal .pnpm to find the start of the package name
# After that, we use the pattern "@?[^@]+" to search for the name
# that appears first, instead of ".+".
#
# Sometimes we could have foo@1.0.0_bar@1.0.0, in which case we want
# to capture foo. With ".+", we could capture foo@1.0.0_bar.
# Instead, we search for the string of characters that do not include
# "@", which translates to "[^@]+". However, some package names include
# @ at the start, so we cover that case, as well.

set -e

option=$1
filename=$2

if [[ $# -eq 2 && $option = "-o" && $filename ]]; then
  echo "Start collecting dependencies"
  pnpm list -w -r --parseable --depth=0 | sed -n -r -e "s|.*\.pnpm/(@?[^@]+).*|\1|p" -e "s/+/\//" | sort -u > $filename
  echo "Dependencies collected"
else
  echo "command usage: $BASH_SOURCE -o filename"
fi
