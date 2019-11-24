const fs = require('fs');
const path = require('path');

module.exports = register => {
  register('generate:after', generator => {
    var asyncapi = generator.asyncapi;

    for (name in asyncapi.channels()) {
        var chan = asyncapi.channel(name);
        var extensions = chan.extensions();
        var className = extensions['x-class-name'];
        console.log("renaming " + name + " to " + className);
        var dir = generator.targetDir + '/src/main/java/com/solace/bean/';
        var newName = name.replace(/\//g, "-");
        fs.renameSync(path.resolve(dir, newName), path.resolve(dir, className + ".java"));
    }
  });
};

function dump(obj) {
    for (p in obj) {
        console.log(p);
    }
}
