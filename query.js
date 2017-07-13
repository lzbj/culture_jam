/**
 * Created by dliu on 2017/7/13.
 */


var request = require('request');


/**
 *
 * params.resturl           the rest apiurl to query
 * params.apiusername   the username to query rest api
 * params.apipassword   the password to query rest api
 * params.slackhook     the webhook slack post to
 * params.slackusername  the username slack use to post message
 * params.slackchannel   the slack channel post message to
 * @param params
 * @returns {Promise}
 */
function main(params) {
    var username = params.apiusername;
    var password = params.apipassword;
    return new Promise(function (resolve, reject) {
        request({
            method: 'GET',
            uri: params.resturl,
            'auth': {
                'user': params.apiusername,
                'pass': params.apipassword,
                'sendImmediately': false
            }
        }, function (err, response, body) {
            if (err) {
                console.log(err);
                reject();
            } else {
                var slackbody = {
                    channel: params.slackchannel,
                    username: params.slackusername || 'Simple Message Bot',
                    text: body
                };
                slackbody = {
                    payload: JSON.stringify(slackbody)
                };
                request.post({
                    url: params.slackhook,
                    formData: slackbody
                }, function (err, res, body) {
                    if (err) {
                        console.log('error', err, body);
                        reject(err);
                    } else {
                        console.log('success', body, 'successfully sent');
                        resolve();
                    }
                });
            }
        });
    });
}
