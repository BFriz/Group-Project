// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '861178280623948', // your App ID
        'clientSecret'  : '49a099e322831ac5f0945581dfa7cd76', // your App Secret
        'callbackURL'   : 'https://moodee.herokuapp.com/auth/facebook/callback'
    }

//     'twitterAuth' : {
//         'consumerKey'       : 'your-consumer-key-here',
//         'consumerSecret'    : 'your-client-secret-here',
//         'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
//     },

//     'googleAuth' : {
//         'clientID'      : 'your-secret-clientID-here',
//         'clientSecret'  : 'your-client-secret-here',
//         'callbackURL'   : 'http://localhost:8080/auth/google/callback'
//     }

};