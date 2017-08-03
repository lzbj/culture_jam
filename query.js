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
    var question_top_pattern = /questions\/hot/gi;
	var question_new_pattern = /questions\/new/gi;
    var score_pattern = /score/gi;
    var invitation_pattern = /invitation/gi;
    var result;
    switch (true) {
        case question_top_pattern.test(resturl):
            result = transform_question(content, resturl);
            break;
		case question_new_pattern.test(resturl):
            result = transform(content, resturl);
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
    var transformed_result = "\n";
	
	transformed_result += "```最新十大问题： \n";
    for (var i = 0; i < message.length; i++) {
        var payload = (i+1) + ". " + message[i]["title"] + ' (answers:' + message[i]["answers"] + ")";
        transformed_result += payload;
        transformed_result += '\n';
    }
    transformed_result += "快来回答你感兴趣的问题，赢取积分，抽得大奖!\n";
    transformed_result += "快速玩转指南：http://ibmurl.hursley.ibm.com/O4Q7\n";
	transformed_result += "5分钟玩转OpenWhisk：http://ibmurl.hursley.ibm.com/O4QB```\n\n";
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
    var transformed_result = "\n";
	
	transformed_result += "```最热门十大问题： \n";
    for (var i = 0; i < message.length; i++) {
        var payload = (i+1) + ". " + message[i]["title"] + ' (answers:' + message[i]["answers"] + ")";
        transformed_result += payload;
        transformed_result += '\n';
    }
    transformed_result += "快来回答你感兴趣的问题，赢取积分，抽得大奖!\n";
    transformed_result += "快速玩转指南：http://ibmurl.hursley.ibm.com/O4Q7\n";
	transformed_result += "5分钟玩转OpenWhisk：http://ibmurl.hursley.ibm.com/O4QB```\n\n";
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
    var transformed_result = "```积分前十名: \n";
    for (var i = 0; i < message.length; i++) {
        var payload = (i+1) + ". " + message[i]["cnName"] + ': ' + message[i]["score"];

        transformed_result += payload;
        transformed_result += '\n';
    }
    transformed_result += "快来回答你感兴趣的问题，赢取积分，抽得大奖!\n";
    transformed_result += "快速玩转指南：http://ibmurl.hursley.ibm.com/O4Q7\n";
	transformed_result += "5分钟玩转OpenWhisk：http://ibmurl.hursley.ibm.com/O4QB```\n\n";
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
    var transformed_result = "```今天邀请好友最多： \n";
    for (var i = 0; i < message.length; i++) {
        var payload = (i + 1) + ". " + message[i]["intranetId"] + '，邀请' + message[i]["invitations"] + "位好友";

        transformed_result += payload;
        transformed_result += '\n';
    }
	
    transformed_result += "快来回答你感兴趣的问题，赢取积分，抽得大奖!\n";
    transformed_result += "快速玩转指南：http://ibmurl.hursley.ibm.com/O4Q7\n";
	transformed_result += "5分钟玩转OpenWhisk：http://ibmurl.hursley.ibm.com/O4QB```\n\n";
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