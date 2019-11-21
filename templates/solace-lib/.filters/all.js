module.exports = ({ Nunjucks, _ }) => {

  var typeMap = new Map();

  typeMap.set('integer', 'int')
  typeMap.set('string', 'String')
  
  Nunjucks.addFilter('camelCase', (str) => {
    return _.camelCase(str);
  });

  Nunjucks.addFilter('upperFirst', (str) => {
    return _.upperFirst(str);
  });

  Nunjucks.addFilter('lowerFirst', (str) => {
    return _.lowerFirst(str);
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

  Nunjucks.addFilter('dump', (obj) => {
    var s = '';
    var p;
    for (const p in obj) {
        s += " ";
        s += p;
    }
    return s;
  });
};
