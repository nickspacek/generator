const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const { parse, AsyncAPIDocument } = require('asyncapi-parser');
const qt = require('quicktype-core');

module.exports = register => {
  register('generate:after', async generator => {
    // TODO let's not re-parse this
    const asyncapi = await parse(generator.originalAsyncAPI);

    // TODO make these properties configurable for java-spring
    const package = 'com.asyncapi.model';
    const srcDir = 'src/main/java';
    const modelsPath = path.resolve(generator.targetDir, srcDir, package.replace(/\./g, '/'));
    await fs.promises.mkdir(modelsPath, { recursive: true} );

    messages = asyncapi.components().messages();
    const inputData = new qt.InputData();
    Object.keys(messages).forEach(async (name) => {
      const component = messages[name];
      const schema = JSON.stringify(component.payload().json());
      const source = { name: component.name(), schema: schema };
      await inputData.addSource('schema', source, () => new qt.JSONSchemaInput(undefined));
    });

    const lang = new qt.JavaTargetLanguage('Java', ['java'], 'java');
    const results = await qt.quicktypeMultiFile({ lang, inputData, rendererOptions: { package } });
    for (const [name, contents] of results) {
      const messagePath = path.resolve(modelsPath, name);
      await fs.promises.writeFile(messagePath, contents.lines.join('\n'));
    }
  });
};
