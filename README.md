# culture_jam
Repo hosts code for culture jam.


# How to use it.

## Create the slack post action.

`wsk action create slackquery query.js`
 
## Invoke the slack post action.

`wsk action invoke slackquery --param resturl "$restapiurl"  --param apiusername "$apiusername" --param apipassword "$apipassword" --param slackhook "$slackhookurl"  --param slackusername  "$slackuser" --param slackchannel "#slackchannel" --blocking --result -d -v`