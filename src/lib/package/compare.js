var ___oldObj = {};

export default {
    oldObj : function clone(oldObj){
        var o;
        switch(typeof oldObj){
            case 'undefined':
                break;
            case 'string'   : o = oldObj + '';
                break;
            case 'number'   : o = oldObj - 0;
                break;
            case 'boolean'  : o = oldObj;
                break;
            case 'object'   :
                if(oldObj === null){
                    o = null;
                }else{
                    if(oldObj instanceof Array){
                        o = [];
                        for(var i = 0, len = oldObj.length; i < len; i++){
                            o.push(clone(oldObj[i]));
                        }
                    }else{
                        o = {};
                        for(var k in oldObj){
                            o[k] = clone(oldObj[k]);
                        }
                    }
                }
                break;
            default:
                o = oldObj;
                break;
        }
        ___oldObj = o;
        return o;
    },
    newObj : function (newObj) {
        var obj = {};
        for(var v in newObj){
            if(newObj[v] != ___oldObj[v]){
                obj[v]=newObj[v];
            }
        }
        return obj;
    }
}
