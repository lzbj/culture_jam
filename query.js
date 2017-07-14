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
    var resturl = params.resturl;
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
                var transformed_result = transform(body,resturl);
                var slackbody = {
                    channel: params.slackchannel,
                    username: params.slackusername || 'Simple Message Bot',
                    text: "" + JSON.stringify(transformed_result, null, 2)
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

/**
 * transform the content as the expected format.
 * @param content
 * @returns {Array}
 */
function transform(content, resturl) {
    var message = JSON.parse(content);
    var transformed_result = [];
    for (var i = 0; i < message.length; i++) {
        payload = "问题 " + i + ":" + ' Question: ' + message[i]["title"] + '  , (ID: ' + message[i]["_id"] + ')' + ', 回答人数: ' + message[i]["answers"];
        data = {
            "": payload,
        };
        transformed_result.push(data);
    }
    ads = {
        "title": "快来回答你感兴趣的问题，赢取积分，抽得大奖!",
        "link": resturl,
        "guide": "http://example.com"
    }

    transformed_result.push(ads);
    return transformed_result;
}
