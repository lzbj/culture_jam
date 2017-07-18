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
    var errMsg = checkParams(params);
    if (errMsg) {
        return {error: errMsg};
    }
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
                var transformed_result = transform_wrapper(body, resturl);
                var slackbody = {
                    channel: params.slackchannel,
                    username: params.slackusername || 'Simple Message Bot',
                    text: transformed_result
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
 * invoke the specific transform function based on
 * the resturl
 */
function transform_wrapper(content, resturl) {
    var question_pattern = /question/gi;
    var score_pattern = /score/gi;
    var invitation_pattern = /invitation/gi;
    var result;
    switch (true) {
        case question_pattern.test(resturl):
            result = transform_question(content, resturl);
            break;
        case score_pattern.test(resturl):
            result = transform_score(content, resturl);
            break;
        case invitation_pattern.test(resturl):
            result = transform_invitation(content, resturl);
            break;
        default:
            result = "Unexpected rest api url was found";
    }
    return result;
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


/**
 * transform the content as the expected format string.
 * @param content
 * @param resturl
 * @returns string
 */
function transform_question(content, resturl) {
    var message = JSON.parse(content);
    var transformed_result = "";
    for (var i = 0; i < message.length; i++) {
        var payload = "问题 " + (i+1) + ":" + ' Question: ' + message[i]["title"] + ', 回答人数: ' + message[i]["answers"];

        transformed_result += payload;
        transformed_result += '\n';
    }
    transformed_result += "快来回答你感兴趣的问题，赢取积分，抽得大奖!\n";
    transformed_result += resturl;
    transformed_result += '\n';
    transformed_result += "http://example.com\n";
    return transformed_result;
}


/**
 * transform the content as the expected format string.
 * @param content
 * @param resturl
 * @returns string
 */
function transform_score(content, resturl) {
    var message = JSON.parse(content);
    var transformed_result = "";
    for (var i = 0; i < message.length; i++) {
        var payload = 'cnName: ' + message[i]["cnName"] + ', enName: ' + message[i]["enName"] + ', intranetID: ' + message[i]["intranetID"] + ', score: ' + message[i]["score"];

        transformed_result += payload;
        transformed_result += '\n';
    }
    transformed_result += "快来回答你感兴趣的问题，赢取积分，抽得大奖!\n";
    transformed_result += resturl;
    transformed_result += '\n';
    transformed_result += "http://example.com\n";
    return transformed_result;
}


/**
 * transform the content as the expected format string.
 * @param content
 * @param resturl
 * @returns string
 */
function transform_invitation(content, resturl) {
    var message = JSON.parse(content);
    var transformed_result = "";
    for (var i = 0; i < message.length; i++) {
        var payload = 'intranetID: ' + message[i]["intranetID"] + ', invitations: ' + message[i]["invitations"];

        transformed_result += payload;
        transformed_result += '\n';
    }
    transformed_result += "快来回答你感兴趣的问题，赢取积分，抽得大奖!\n";
    transformed_result += resturl;
    transformed_result += '\n';
    transformed_result += "http://example.com\n";
    return transformed_result;
}

/**
 * check if required params are set.
 * @param params
 */
function checkParams(params) {
    if (params.resturl === undefined && params.slackhook === undefined) {
        return 'No resturl and slackhook provided';
    }
    else if (params.apiusername === undefined && params.apipassword === undefined) {
        return 'No rest api username and rest api password provided';
    } else if (params.slackchannel === undefined) {
        return 'No channel provided';
    } else {
        return undefined;
    }

}