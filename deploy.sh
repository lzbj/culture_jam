#!/usr/bin/env bash

source local.env

wsk action create slackquery query.js

wsk trigger create periodic \
--feed /whisk.system/alarms/alarm \
--param cron "* * * * *" \
--param trigger_payload "{\"resturl\":\"$restapiurl\",\"apiusername\":\"$apiusername\",\"apipassword\":\"$apipassword\",\"slackhook\":\"$slackhook\",\"slackusername\":\"$slackusername\",\"slackchannel\":\"$slackchannel\"}"


wsk rule create query_hot periodic slackquery