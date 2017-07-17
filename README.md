# culture_jam
Repo hosts code for culture jam.


# How to use it.

## Create the slack post action.

`wsk action create slackquery query.js`
 
## Invoke the slack post action.

`wsk action invoke slackquery --param resturl "$restapiurl"  --param apiusername "$apiusername" --param apipassword "$apipassword" --param slackhook "$slackhookurl"  --param slackusername  "$slackuser" --param slackchannel "#slackchannel" --blocking --result -d -v`

## Utilize the alarms package.

One can utilize the /whisk.system/alarms package to periodically trigger the slackquery action created before.

The command as below:

`wsk trigger create periodic \
  --feed /whisk.system/alarms/alarm \
  --param cron "* * * * *" \
  --param trigger_payload "{\"resturl\":\"$restapiurl\",\"apiusername\":\"$apiusername\",\"apipassword\":\"$apipassword\",\"slackhook\":\"$slackhook\",\"slackusername\":\"$slackusername\",\"slackchannel\":\"$slackchannel\"}"`

You can define the variables in you env to save your time copy and post.

## Create the rule
After action and trigger creation, we need a rule to bind them.

`wsk rule query_hot priodic  slackquery`

This command will create a rule the link the action and the trigger, now you should be able to see
the slackquery action posted message in you specified slack channel every minute as you assigned.

You can disable the rule.

`wsk rule disable query_hot`
