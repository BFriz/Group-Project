var uristring = 
  process.env.MONGOLAB_URI || 
  'mongodb://localhost/moodsdb';

  module.exports = {

    'url' : uristring // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};