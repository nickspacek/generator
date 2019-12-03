const path = require('path');
const fs = require('fs');
const _ = require('lodash');

module.exports = register => {
  register('generate:after', async generator => {
    const asyncapi = generator.originalAsyncAPI;
    // TODO make these properties configurable for java-spring
    const modelsPackage = 'com.asyncapi.model';
    const srcDir = 'src/main/java';
    const modelsPath = path.resolve(generator.targetDir, srcDir, modelsPackage.replace(/\./g, '/'));
    const modelsDir = await fs.promises.opendir(modelsPath);String.replace
    for await (const entry of modelsDir) {
        if (entry.isFile()) {
            const modelName = path.basename(entry.name, '.java');
            const destPath = path.resolve(modelsPath, _.upperFirst(_.camelCase(modelName)) + '.java');
            const sourcePath = path.resolve(modelsPath, entry.name);
            await fs.promises.rename(sourcePath, destPath);
        }
    }
  });
};
