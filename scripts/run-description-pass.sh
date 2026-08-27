#!/bin/bash
#
# One day's slice of the YouTube description pass, for unattended runs.
#
# A full pass is ~13,550 quota units against a 10,000/day limit, so it takes
# two days. Rather than pin dates, this just runs daily and converges: the
# script skips any video already carrying the exact desired description, so
# day two picks up the remainder and every day after that updates nothing and
# costs ~15 read units. Safe to leave scheduled; safe to run twice.
#
# Scheduled by ~/Library/LaunchAgents/com.mdggrowth.hobbinomicon.descriptions.plist
# at 03:10 local, just past the midnight-Pacific quota reset.
#
# Remove with:
#   launchctl unload ~/Library/LaunchAgents/com.mdggrowth.hobbinomicon.descriptions.plist
#   rm ~/Library/LaunchAgents/com.mdggrowth.hobbinomicon.descriptions.plist

set -uo pipefail

REPO="/Users/mattglbrt/Documents/dev/mdggrowth/hobbinomicon"
NODE="/opt/homebrew/bin/node"
LOG="$REPO/scripts/.description-pass.log"

cd "$REPO" || exit 1

{
  echo
  echo "================================================================"
  echo "run started $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo "================================================================"
} >>"$LOG"

# The OAuth app is unverified, so the refresh token dies after 7 days. When
# that happens this exits non-zero having written nothing, and the log says so
# — re-auth is interactive (browser consent) and cannot be automated.
"$NODE" scripts/update-descriptions.cjs --run --max 190 >>"$LOG" 2>&1
status=$?

if [ $status -ne 0 ]; then
  echo "FAILED (exit $status) — likely an expired refresh token." >>"$LOG"
  echo "Run 'npm run youtube-auth' and pick the Hobbinomicon channel." >>"$LOG"
fi

echo "run finished $(date '+%Y-%m-%d %H:%M:%S %Z') (exit $status)" >>"$LOG"
exit $status
