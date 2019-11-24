module.exports = ({ Nunjucks, _ }) => {

  var typeMap = new Map();
  typeMap.set('integer', 'int')
  typeMap.set('string', 'String')
  
  var formats = new Map();
  formats.set('string', '%s');
  formats.set('enum', '%s');
  formats.set('integer', '%d');

  Nunjucks.addFilter('topicInfo', ([channelName, channel]) => {
    var ret = {};
    var publishTopic = String(channelName);
    var subscribeTopic = String(channelName);

    var params = [];

    console.log("params: " + JSON.stringify(channel.parameters()));
    for (var name in channel.parameters()) {
        var nameWithBrackets = "{" + name + "}";
        var schema = channel.parameter(name)['_json']['schema']
        console.log("schema: " + dump(schema))
        var type = schema.type
        var param = { "name" : _.upperFirst(name) }

        if (type) {
            console.log("It's a type: " + type)
            param.type = type
            var printfArg = formats.get(type)
            console.log("printf: " + printfArg)
            if (!printfArg) throw new Error("topicInfo filter: Unknown type: " + type)
            console.log("Replacing " + nameWithBrackets);
            publishTopic = publishTopic.replace(nameWithBrackets, printfArg);
        } else {
            var en = schema.enum;
            if (en) {
                console.log("It's an enum: " + en)
                param.type = "enum"
                param.enum = en;
                console.log("Replacing " + nameWithBrackets);
                publishTopic = publishTopic.replace(nameWithBrackets, "%s");
            } else {
                throw new Error("topicInfo filter: Unknown parameter type: " + JSON.stringify(schema))
            }
        }

        subscribeTopic = subscribeTopic.replace(nameWithBrackets, "*");
        params.push(param)
    }
    ret.channelName = channelName;
    ret.params = params;
    ret.publishTopic = publishTopic;
    ret.subscribeTopic = subscribeTopic;
    return ret;
/*
var topic = "solace/orders/{verb}/1/{trace}/{span}";


var params = [
    { 'name': 'verb', 'type': 'enum' },
    { 'name': 'trace', 'type': 'string' },
    { 'name': 'span', 'type': 'integer' },
    ];

foo = processTopic(topic, params);
console.log(foo);

function processTopic(topic, params) {
    var parts = topic.split('/');

    for (var i in params) {
        var param = params[i];
        var name = "{" + param.name + "}";
        var format = formats.get(param.type);
        console.log("param: " + name + " " + format);
        topic = topic.replace(name, format);
    }

    ret.params = params;
    ret.topic = topic;
    return ret;
}
*/


  });

  Nunjucks.addFilter('fixType', (str) => {
    var ret = typeMap.get(str);
    if (!ret) {
        ret = str;
    }
    return ret;
  });

  Nunjucks.addFilter('propNames', (schema) => {
    var ret = [];
    for (var p in schema) {
        ret.push(p);
    }
    return ret;
  });

  function dump(obj) {
    var s = '';
    var p;
    for (const p in obj) {
        s += " ";
        s += p;
    }
    return s;
  }

  Nunjucks.addFilter('dump', dump);

  Nunjucks.addFilter('camelCase', (str) => {
    return _.camelCase(str);
  });

  Nunjucks.addFilter('upperFirst', (str) => {
    return _.upperFirst(str);
  });

  Nunjucks.addFilter('lowerFirst', (str) => {
    return _.lowerFirst(str);
  });


};
