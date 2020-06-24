const fs = require('fs');


function addControllers(dir, prefix) {

    var files = fs.readdirSync(dir);
    var prefix = prefix || '';

    var js_files = files.filter((f) => {
        return f.endsWith('.vue');
    });
    for (var f of files) {
        if (js_files.indexOf(f) > -1) {
            var test = `${prefix}/${f}`;
            test = test.substring(1, test.length - 4);
            test = String(test).toLowerCase();
            route.push([test, `../page${prefix}/${f}`]);
        } else {
            console.log(dir + '/' + f, prefix + '/' + f)

            addControllers(dir + '/' + f, prefix + '/' + f)
        }
    }
}

var route = [];

addControllers(__dirname + '/../src/page');
// console.log(666)
var str = '';
for (var i of route) {
    str = str + `     '${i[0]}': resolve => require(['${i[1]}'], resolve),` + '\n';
}

str = str + `\n       //首页\n      '/': resolve => require(['../page/Index.vue'], resolve)` + '\n';

var data = '//基本路由 \n' +
    'export default {' + '\n' +
    str +
    '}';

fs.writeFile(__dirname + '/../src/router/index.js', data, function(err) {
    if (err) {
        console.log('写入失败:' + err);
    } else {
        console.log('写入完成');
    }
});