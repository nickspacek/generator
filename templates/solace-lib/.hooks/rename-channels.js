const fs = require('fs')
const path = require('path')

const sourceHead = '/src/main/java/'

module.exports = register => {
  register('generate:after', generator => {
    var asyncapi = generator.asyncapi
    var sourcePath = generator.targetDir + sourceHead
    var info = asyncapi.info()
    console.log('dumping.....')
    dump(info)
    console.log('dumping.....')

    if (info) {
        var extensions = info.extensions()
        if (extensions) {
            var package = extensions['x-java-package']
            if (package) {
                console.log("package: " + package)
                var overridePath = generator.targetDir + sourceHead + package.replace(/\./g, '/') + '/'
                console.log("Moving from " + sourcePath + " to " + overridePath)
                var first = true
                fs.readdirSync(sourcePath).forEach( file => {
                    if (first) {
                        first = false
                        fs.mkdirSync(overridePath, { recursive: true })
                    }
                    console.log("file: " + file)
                    fs.copyFileSync(path.resolve(sourcePath, file), path.resolve(overridePath, file))
                    fs.unlinkSync(path.resolve(sourcePath, file))
                })
                sourcePath = overridePath
            }
        }
    }

    for (name in asyncapi.channels()) {
        var chan = asyncapi.channel(name)
        extensions = chan.extensions()
        var className = extensions['x-java-class']
        console.log("renaming " + name + " to " + className)
        var newName = name.replace(/\//g, "-")
        fs.renameSync(path.resolve(sourcePath, newName), path.resolve(sourcePath, className + ".java"))
    }
  })
}

function dump(obj) {
    for (p in obj) {
        console.log(p)
    }
}
