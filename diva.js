var Diva=function(code){
  this.code=code.toString();
  this.stdout="";
  this.stderr="";
  this.memory={
    vars:
      {
         null:{type:'null'}
        ,'true':{type:'boolean',value:true}
        ,'false':{type:'boolean',value:false}
        ,NaN:{type:'int',value:NaN}
        ,Infinity:{type:'int',value:1/0}
        ,PI:{type:'float',value:Math.PI}
        ,E:{type:'float',value:Math.E}
        ,I:{type:'complex',value:[0,1]}
        
        
        ,'if':{type:'func',value:{rtype:"boolean",'native':true,func:function(args){var v=args[args.length-1];return v;}}}
        ,'alert':{type:'func',value:{rtype:"null",'native':true,func:function(args,_this){alert(args.map(function(i){return _this.toStr(i)}));}}}
        ,'print':{type:'func',value:{rtype:"null",'native':true,func:function(args,_this){
            args.forEach(function(v){
              _this.stdout+=_this.toStr(v)+"\n";
            });}}
        }
        ,'typeof':{type:'func',value:{rtype:"string",'native':true,func:function(args){return {type:"string",value:args[args.length-1].type}}}}
        
        ,'log':{type:'func',value:{'native':true,func:function(args,_this){
            if(!args[0]||!args[0])return{type:'null'};
            if(args[0].type=="float"||args[0].type=="int")
              return {type:'float',value:Math.log(args[0].value)};
            if(args[0].type=="complex"){
              var a=args[0].value[0];
              var b=args[0].value[1];
              return {type:"complex",value:[Math.log(a*a+b*b)/2,a<0?(Math.PI-Math.atan(Math.abs(b/a)))*(b<0?-1:1):Math.atan(b/(a||0))]}
            }
          }}
        }
        ,'sin':{type:'func',value:{'native':true,func:function(args,_this){
            if(!args[0]||!args[0])return{type:'null'};
            if(args[0].type=="float"||args[0].type=="int")
              return {type:'float',value:Math.sin(args[0].value)};
            if(args[0].type=="complex"){
              var a=args[0].value[0];
              var b=args[0].value[1];
              return {type:"complex",value:[Math.sin(a)*_this.funcs.cosh(b),Math.cos(a)*_this.funcs.sinh(b)]}
            }
          }}
        }
        ,'cos':{type:'func',value:{'native':true,func:function(args,_this){
            if(!args[0]||!args[0])return{type:'null'};
            if(args[0].type=="float"||args[0].type=="int")
              return {type:'float',value:Math.cos(args[0].value)};
            if(args[0].type=="complex"){
              var a=args[0].value[0];
              var b=args[0].value[1];
              return {type:"complex",value:[Math.cos(a)*_this.funcs.cosh(b),-Math.sin(a)*_this.funcs.sinh(b)]}
            }
          }}
        }
        ,'tan':{type:'func',value:{'native':true,func:function(args,_this){
            if(!args[0]||!args[0])return{type:'null'};
            if(args[0].type=="float"||args[0].type=="int")
              return {type:'float',value:Math.tan(args[0].value)};
            if(args[0].type=="complex"){
              var a=args[0].value[0];
              var b=args[0].value[1];
              var bb=Math.cos(2*a)+_this.funcs.cosh(2*b); //分母
              /*
                tanx=(sin(2a)+isinh(2b))/(cos(2a)+cosh(2b))
              */
              return {type:"complex",value:[Math.sin(2*a)/bb,_this.funcs.sinh(2*b)/bb]}
            }
          }}
        }
        
        ,'sinh':{type:'func',value:{'native':true,func:function(args,_this){
            if(!args[0]||!args[0])return{type:'null'};
            if(args[0].type=="float"||args[0].type=="int")
              return {type:'float',value:_this.funcs.sinh(args[0].value)};
            if(args[0].type=="complex"){
              var a=args[0].value[0];
              var b=args[0].value[1];
              return {type:"complex",value:[_this.funcs.sinh(a)*Math.cos(b),_this.funcs.cosh(a)*Math.sin(b)]}
            }
          }}
        }
        ,'cosh':{type:'func',value:{'native':true,func:function(args,_this){
            if(!args[0]||!args[0])return{type:'null'};
            if(args[0].type=="float"||args[0].type=="int")
              return {type:'float',value:_this.funcs.cosh(args[0].value)};
            if(args[0].type=="complex"){
              var a=args[0].value[0];
              var b=args[0].value[1];
              return {type:"complex",value:[_this.funcs.cosh(a)*Math.cos(b),_this.funcs.sinh(a)*Math.sin(b)]}
            }
          }}
        }
        
        ,'sqrt':{type:'func',value:{rtype:"float",'native':true,func:function(args,_this){
            var a=_this.forceType(args[0]||{},"float");
            return {type:'float',value:Math.sqrt(a.value)};
          }}
        }
        
        
        
        ,'int':{
          type:'class',
          name:'int',
         // const:1,
          value:{
            constructor:{native:true,func:function(args,_this,scope,ops){
              return (args[0]&&_this.forceType(args[0],'int'))||0;
            }},
            props:{
              log:{type:'func',value:{native:true,func:function(args,_this,scope,self){
                var data=self.data||{};
                var th=data.this;
                var x=1;
                if(th)x=th.value;
                return {
                  type:'float'
                  ,value:args[0]?Math.log(th.value)/Math.log(args[0].value):Math.log(th.value)}
              }}}
            },
            statics:{},
            toStr:{
               type:'func'
              ,value:{native:true
              ,func:function(val){return val.toString();}
            }}
          }
        },
        'float':{
          type:'class',
          name:'float',
         // const:1,
          value:{
            'extends':null,
            'implements':[],
            constructor:{native:true,func:function(args,_this,scope,ops){
              return (args[0]&&_this.forceType(args[0],'float'))||0;
            }},
            props:{
              'val':{type:'int',value:100}
            },
            statics:{
              'v':{type:'int',value:1000}
            },
            toStr:function(val){
              val.toString();
            }
          }
        },
        'complex':{
          type:'class',
          name:'complex',
         // const:1,
          value:{
            'extends':null,
            'implements':[],
            constructor:{native:true,func:function(args,_this,scope,ops){
              return (args[0]&&_this.forceType(args[0],'complex'))||[0,0];
            }},
            props:{
              'val':{type:'int',value:100}
            },
            statics:{
              'v':{type:'int',value:1000}
            },
            toStr:function(val){
              val.toString();
            }
          }
        },
        'string':{
          type:'class',
          name:'string',
         // const:1,
          value:{
            'extends':null,
            'implements':[],
            constructor:{native:true,func:function(args,_this,scope,ops){
              return (args[0]&&_this.forceType(args[0],'string'))||'';
            }},
            props:{
              'val':0
            },
            statics:{
              'v':{type:'int',value:10}
            },
            toStr:function(val){
              val.toString();
            }
          }
        },
        'boolean':{
          type:'class',
          name:'boolean',
         // const:1,
          value:{
            'extends':null,
            'implements':[],
            constructor:{native:true,func:function(args,_this,scope,ops){
              return (args[0]&&_this.forceType(args[0],'boolean'))||0;
            }},
            props:{
              'val':0
            },
            statics:{
              'v':{type:'int',value:10}
            },
            toStr:function(val){
              val.toString();
            }
          }
        },
        'struct':{
          type:'class',
          name:'struct',
         // const:1,
          value:{
            'extends':null,
            'implements':[],
            constructor:{native:true,func:function(args,_this,scope,ops){
              return {};
            }},
            props:{
              'val':0
            },
            statics:{
              'v':{type:'int',value:10}
            },
            toStr:function(val){
              val.toString();
            }
          }
        },
        'func':{
          type:'class',
          name:'func',
         // const:1,
          value:{
            'extends':null,
            'implements':[],
            constructor:{native:true,func:function(args,_this,scope,ops){
              return {native:false,func:{args:[],code:[]}};
              
            }},
            props:{
              'val':0
            },
            statics:{
              'v':{type:'int',value:10}
            },
            toStr:function(val){
              val.toString();
            }
          }
        },
        0:{}
      }
  };
  this.operateFunction=function(args,_this,scope,ops){
    var a=args[0],b=args[1];
    var fs=ops.fs;
    var consider=(fs||{})['[consider]'];
    var result;
    if(!a)a={type:'[none]'};
    if(consider&&consider[a.type]){
      a=_this.runFunc(consider[a.type],[a.value],scope);
    }
    var ffobj=fs[a.type]||fs['[others]']
    if(ffobj){
      var fobj=ffobj[b.type]||ffobj['[others]'];
      if(fobj){
        result=_this.runFunc(fobj,[a.value,b.value],scope);
      }
    }
    if(typeof result=='object'&&!Array.isArray(result))
      return result;
  };
  this.funcs={
    sinh:function(a){
      var ea=Math.pow(Math.E,a);
      return(ea-1/ea)/2;
    }
    ,cosh:function(a){
      var ea=Math.pow(Math.E,a);
      return(ea+1/ea)/2;
    }
  };
  this.grammar={
    symbol:['+','-','*','/','%','=','.',',','<','>','?','!',':','{','}','[',']','(',')','#','&','|','^',';','\\',"@",'~'],
    operator:[/*
      "operatorName":{
        int type: flag
        [:
          = += ...->000(0)  (x=y)
          ? op    ->001(1)  (x++)
          ? op ?  ->010(2)  (x+y)
            op ?  ->100(4)  (!x)
          ([?]) op ([?]) -> -(n)
        ]
        boolean native: isNativeFunction
        func func:function(args :array, _this :instance ,ops : {})
      }
    */
      {
        "=":{
          type:0,
          'native':true,
          func:function(args,_this){
            var a=args[0],b=args[1];
            if(a.const){
              if(a.const==2)a.const--;
              else _this.throw("ReferenceError",a.name+" is constant");
            }
            if(a.type==b.type){
            a.value=b.value;
            }
            else if(a.type=="null"){
              a.type=b.type;
              a.value=b.value;
            }else{
              a.value=_this.forceType(b,a.type).value;
            }
            return a;
          }
        },
        "+=":{
          type:0,
          'native':true,
          func:function(args,_this,scope){
            var plus=_this.searchOperator('+')[1];
            var equal=_this.searchOperator('=')[1];
            var pl=_this.runFunc(plus,args,scope);
            return _this.runFunc(equal,[args[0],pl],scope);
          }
        },
        "-=":{
          type:0,
          'native':true,
          func:function(args,_this,scope){
            var plus=_this.searchOperator('-')[1];
            var equal=_this.searchOperator('=')[1];
            var pl=_this.runFunc(plus,args,scope);
            return _this.runFunc(equal,[args[0],pl],scope);
          }
        }
      },//代入演算子(最優先)
      {
        ".":{
          type:-2,
          'native':true,
          func:function(args,_this,scope){
            var a=args[0],b=args[1];
            var obj=_this.getProperty(a,b);
            if(obj.type=="func"){
              obj=_this.clone(obj);
              obj.value=obj.value||{};
              obj.value.data=obj.data||{};
              obj.value.data.this=a;
            }
            return obj;
          }
        },
        "::":{
          type:-2,
          'native':true,
          func:function(args,_this,scope){
            var a=args[0],b=args[1];
            var cl=_this.getVar(a.type,scope);
            var st=_this.getProperty(cl,b);
            
            return st;
          }
        },
        "=":{ //関数呼び出し演算子(一時演算子)
          type:2,
          'native':true,
          list:true,
          func:function(args,_this,scope){
            
            var a=args[0],b=args[1];
            
            if(a.type!="func")_this.throw("TypeError",a.name+" is not a function");
            return _this.runFunc(a.value,b,scope);
          }
        }
      },
      {
        "++":{
          type:1+4,
          native:true,
          func:function(args,_this,scope){
            if(args[0]){//x++;
              var plus=_this.searchOperator('+=')[1];
              var rt=_this.clone(args[0]);
              var pl=_this.runFunc(plus,[args[0],{type:'int',value:1}],scope);
              return rt;
            }else{
              var plus=_this.searchOperator('+=')[1];
              var pl=_this.runFunc(plus,[args[1],{type:'int',value:1}],scope);
              return pl;
            }
          }
        }
        ,"--":{
          type:1+4,
          native:true,
          func:function(args,_this,scope){
            if(args[0]){//x--;
              var minus=_this.searchOperator('-=')[1];
              var rt=_this.clone(args[0]);
              var pl=_this.runFunc(minus,[args[0],{type:'int',value:1}],scope);
              return rt;
            }else{
              var minus=_this.searchOperator('-=')[1];
              var pl=_this.runFunc(minus,[args[1],{type:'int',value:1}],scope);
              return pl;
            }
          }
        }
      },
      {
        "**":{
          type:2,
          'native':true,
          func:this.operateFunction,
          'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
              ,int:{native:true,func:function(v){return {type:'float',value:v}}}
            }
            ,'[others]':{native:true,func:function(){}}
           /* ,'int':{
               'int':{native:true,func:function(args){return {type:'int',value:Math.pow(args[0],args[1])}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:Math.pow(args[0],args[1])}}}
            }*/
            ,'float':{
              'int':{native:true,func:function(args){return {type:'float',value:Math.pow(args[0],args[1])}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:Math.pow(args[0],args[1])}}}
            }
            ,'string':{
              'int':{native:true,func:function(args){return {type:'string',value:Math.pow(args[0],args[1])}}}
            }
            ,'complex':{
              'int':{native:true,func:function(args,_this,scope){
                var multi=_this.searchOperator('*')[1];
                var c={type:'complex',value:[1,0]};
                var a={type:'complex',value:args[0]};
                var max=args[1];
                var min=max<0;
                max=Math.abs(max);
                for(var i=0;i<max;i++)
                  c=_this.runFunc(multi,[c,a],scope);//c*=a
                return min?1/c:c;
              }}
            }
          }
        }
      },
      {
        "*":{
          type:2,
          'native':true,
          func:this.operateFunction,
          'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
            }
            ,'[others]':{native:true,func:function(){}}
            ,'int':{
               'int':{native:true,func:function(args){return {type:'int',value:args[0]*args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]*args[1]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[args[1][0]*args[0],args[1][1]*args[0]]}}}
            }
            ,'float':{
              'int':{native:true,func:function(args){return {type:'float',value:args[0]*args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]*args[1]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[args[1][0]*args[0],args[1][1]*args[0]]}}}
            }
            ,'complex':{
              'int':{native:true,func:function(args){return {type:'complex',value:[args[0][0]*args[1],args[0][1]*args[1]]}}}
              ,'float':{native:true,func:function(args){return {type:'complex',value:[args[0][0]*args[1],args[0][1]*args[1]]}}}
              ,'complex':{native:true,func:function(args){
                var a=args[0][0];
                var b=args[0][1];
                var c=args[1][0];
                var d=args[1][1];
                return {type:'complex',value:[a*c-b*d,a*d+b*c]}
              }}
            }
            ,'string':{
              'int':{native:true,func:function(args){return {type:'string',value:(function(i){var rs="";while(i-->0){rs+=args[0]}return rs})(args[1])}}}
            }
          }
        },
        "/":{
          type:2,
          'native':true,
          func:this.operateFunction,
          'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
            }
            ,'[others]':{native:true,func:function(){}}
            ,'int':{
               'int':{native:true,func:function(args){return {type:'int',value:args[0]/args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]/args[1]}}}
            }
            ,'float':{
              'int':{native:true,func:function(args){return {type:'float',value:args[0]/args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]/args[1]}}}
            }
            ,'string':{
              'int':{native:true,func:function(args){return {type:'string',value:(function(i){var rs="";while(i-->0){rs+=args[0]}return rs})(args[1])}}}
            }
            ,'complex':{
               'int':{native:true,func:function(args){return {type:'complex',value:[args[0][0]/args[1],args[0][1]/args[1]]}}}
               ,'float':{native:true,func:function(args){return {type:'complex',value:[args[0][0]/args[1],args[0][1]/args[1]]}}}
               ,'complex':{native:true,func:function(args){
                var a=args[0][0];
                var b=args[0][1];
                var c=args[1][0];
                var d=args[1][1];
                return {type:'complex',value:[(a*c+b*d)/(c*c+d*d),(b*c-a*d)/(c*c+d*d)]}
              }}
            }
          }
        }
      },
      {
        "%":{
          type:2+4,
          'native':true,
          func:this.operateFunction,
          'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
            }
            ,'[others]':{native:true,func:function(){}}
            ,'int':{
               'int':{native:true,func:function(args){return {type:'int',value:args[0]%args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]%args[1]}}}
              ,'string':{native:true,func:function(args){return {type:'string',value:args[0]%args[1]}}}
            }
            ,'float':{
              'int':{native:true,func:function(args){return {type:'float',value:args[0]%args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]%args[1]}}}
            }
            ,'string':{
              'int':{native:true,func:function(args){return {type:'string',value:args[0]%args[1]}}}
              ,'string':{native:true,func:function(args){return {type:'string',value:args[0]%args[1]}}}
            }
          }
        },
      },
      {
        "+":{
          type:2+4,
          'native':true,
          func:this.operateFunction,
          'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
            }
            ,'[others]':{native:true,func:function(){}}
            ,'[none]':{
              'int':{native:true,func:function(args){return {type:'int',value:args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[1]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:args[1]}}}
            }
            ,'int':{
               'int':{native:true,func:function(args){return {type:'int',value:args[0]+args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]+args[1]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[args[0]+args[1][0],args[1][1]]}}}
              ,'string':{native:true,func:function(args){return {type:'string',value:args[0]+args[1]}}}
            }
            ,'float':{
              'int':{native:true,func:function(args){return {type:'float',value:args[0]+args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]+args[1]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[args[0]+args[1][0],args[1][1]]}}}
              ,'string':{native:true,func:function(args){return {type:'string',value:args[0]+args[1]}}}
            }
            ,'complex':{
              'int':{native:true,func:function(args){return {type:'complex',value:[args[0][0]+args[1],args[0][1]]}}}
              ,'float':{native:true,func:function(args){return {type:'complex',value:[args[0][0]+args[1],args[0][1]]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[args[0][0]+args[1][0],args[0][1]+args[1][1]]}}}
              ,'string':{native:true,func:function(args,_this){return {type:'string',value:_this.toStr({type:'complex',value:args[0]})+args[1]}}}
            }
            ,'string':{
              'int':{native:true,func:function(args){return {type:'string',value:args[0]+args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'string',value:args[0]+args[1]}}}
              ,'complex':{native:true,func:function(args,_this){return {type:'string',value:args[0]+_this.toStr({type:'complex',value:args[1]})}}}
              ,'string':{native:true,func:function(args){return {type:'string',value:args[0]+args[1]}}}
              ,'boolean':{native:true,func:function(args){return {type:'string',value:args[0]+args[1]}}}
            }
          }
        },
        "-":{
          type:2+4,
          'native':true,
          func:this.operateFunction
          ,'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
            }
            ,'[others]':{native:true,func:function(){}}
            ,'[none]':{
              'int':{native:true,func:function(args){return {type:'int',value:-args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:-args[1]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[-args[1][0],-args[1][1]]}}}
            }
            ,'int':{
               'int':{native:true,func:function(args){return {type:'int',value:args[0]-args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]-args[1]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[args[0]-args[1][0],-args[1][1]]}}}
            }
            ,'float':{
              'int':{native:true,func:function(args){return {type:'float',value:args[0]-args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'float',value:args[0]-args[1]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[args[0]-args[1][0],-args[1][1]]}}}
            }
            ,'complex':{
              'int':{native:true,func:function(args){return {type:'complex',value:[args[0][0]-args[1],args[0][1]]}}}
              ,'float':{native:true,func:function(args){return {type:'complex',value:[args[0][0]-args[1],args[0][1]]}}}
              ,'complex':{native:true,func:function(args){return {type:'complex',value:[args[0][0]-args[1][0],args[0][1]-args[1][1]]}}}
            }
            ,'string':{
              'int':{native:true,func:function(args){return {type:'string',value:args[0]-args[1]}}}
              ,'string':{native:true,func:function(args){return {type:'string',value:args[0]-args[1]}}}
            }
          }
        }
      },
      {
        "==":{
          type:2,
          'native':true,
          func:this.operateFunction,
          'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
            }
            ,'[others]':{
              '[others]':{native:true,func:function(args){return {type:'boolean',value:args[0]==args[1]}}}
            }
            ,'int':{
               'int':{native:true,func:function(args){return {type:'boolean',value:args[0]==args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'boolean',value:args[0]==args[1]}}}
            }
            ,'float':{
              'int':{native:true,func:function(args){return {type:'boolean',value:args[0]==args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'boolean',value:args[0]==args[1]}}}
            }
            
          }
        }
        ,"<":{
          type:2,
          'native':true,
          func:this.operateFunction,
          'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
            }
            ,'[others]':{
              '[others]':{native:true,func:function(){}}
            }
            ,'int':{
               'int':{native:true,func:function(args){return {type:'boolean',value:args[0]<args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'boolean',value:args[0]<args[1]}}}
            }
            ,'float':{
              'int':{native:true,func:function(args){return {type:'boolean',value:args[0]<args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'boolean',value:args[0]<args[1]}}}
            }
          }
        }
        ,">":{
          type:2,
          'native':true,
          func:this.operateFunction,
          'fs':{
            '[consider]':{
              null:{native:true,func:function(){return {type:'int',value:0}}}
            }
            ,'[others]':{
              '[others]':{native:true,func:function(){}}
            }
            ,'int':{
               'int':{native:true,func:function(args){return {type:'boolean',value:args[0]>args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'boolean',value:args[0]>args[1]}}}
            }
            ,'float':{
              'int':{native:true,func:function(args){return {type:'boolean',value:args[0]>args[1]}}}
              ,'float':{native:true,func:function(args){return {type:'boolean',value:args[0]>args[1]}}}
            }
          }
        }
      },
      {
        "||":{
          type:2,
          'native':true,
          func:function(args,_this){
            return _this.isTrue(args[0])?args[0]:args[1];
          }
        }
        ,"&&":{
          type:2,
          'native':true,
          func:function(args,_this){
            return _this.isTrue(args[0])?args[1]:args[0];
          }
        }
      }
    ]
  };
  this.toType={
    '[to]':{
       null:{native:true,func:function(args){return;}}
      ,boolean:{native:true,func:function(args){
        var type=args[0].type;
        if(type=="int"||type=="float"||type=="string"||type=="null")return !!(args[0].value);
        //if(type==null)return false;
        return true;
      }}
      ,string:{native:true,func:function(args){
        var type=args[0].type;
        if(['int','float','string','boolean','null'].indexOf(type)+1){
          return type=='null'?'null':(args[0].value.toString());
        }else if(type=="complex"){
          var val=args[0].value;
          return ((val[0]||"")+(val[1]?(
            val[0]?(val[1]==1?"":val[1]==-1?"-":(val[1]>0?"+":"")+val[1])
                  :(val[1]==1?"":val[1]==-1?"-":val[1])
          )+"i":""))||"0";
        }else{
          return '[Object '+type+']';
        }
      }}
    }
    ,null:{
      int:{native:true,func:function(args){return 0;}}
      ,float:{native:true,func:function(args){return 0;}}
      ,complex:{native:true,func:function(args){return [0,0];}}
    }
    ,int:{
      float:{native:true,func:function(args){return args[0].value}}
      ,complex:{native:true,func:function(args){return [args[0].value,0]}}
      ,string:{native:true,func:function(args){return args[0].value.toString()}}
    }
    ,float:{
      int:{native:true,func:function(args){return parseInt(args[0].value)}}
      ,complex:{native:true,func:function(args){return [args[0].value,0]}}
      ,string:{native:true,func:function(args){return args[0].value.toString()}}
    }
    ,complex:{
      float:{native:true,func:function(args){return args[0].value[0]}}
    }
  };
};
Diva.prototype={
  run:function(){
   // try{
      var code=this.code;
      var scope=[0];
      if(typeof code!=='string'){
        throw "コードがセットされていません。";
      }
      /*分解*/
      this.code=code;
      var d1=new Date;
      this.tree=this.makeTree(scope);
      var d2=new Date;
      this.process(this.tree,scope);
      var d3=new Date;
      return[d2-d1,d3-d2];
    /*}catch(e){
      throw e;
    }*/
  }
  ,process:function self(tree,scope,_this){
    var _this=_this||this;
    var returnValue=null;
    for(i in tree){
      var v=tree[i];
      if(Array.isArray(v)){
        var vf=v[0];
        if(vf==";"){
          _this.exec(v[1],scope);
        }else if(vf=="if"){
          var els=false;
          for(var ifn=1;ifn<v.length;ifn++){
            var ifv=v[ifn];
            if(ifv=="else"){
              els=true;continue;
            }else
            if(ifv=="if"){els=false;continue;}
            else if(els){
              var rv=self(v[ifn],scope,_this);
              if(rv)return rv;
              break;
            }
            if(_this.isTrue(_this.exec(ifv,scope))){
              var rv=self(v[ifn+1],scope,_this);
              if(rv)return rv;
              break;
            }
            ifn++;
          }
        }else if(vf=="while"){
          while(_this.isTrue(_this.exec(v[1],scope))){
            var rv=self(v[2],scope,_this);
            if(rv)return rv;
          }
        }else if(vf=="block"){
          var sc=_this.getScope(scope);
          var blockn=v[1];
          sc[blockn]={};
          var ars=_this.clone(scope);
          ars.push(blockn);
          blockn++;
          var rv=self(v[2],ars,_this);
          if(rv)return rv;
        }else if(vf=="return"){
          var rv=_this.exec(v[1],scope)||{type:"null"};
          return rv;
        }
      }else{
        if(v=="\n")continue;
        throw "Diva:配列じゃないのキタ"+v;
      }
    };
    return returnValue;
  }
  ,getScope:function(scope){
    scope=scope||[0];
    if(!Array.isArray(scope))throw "Diva:Unexpected Array "+scope;
    return scope.reduce(function(a,t,i){
      return a[t];
    },this.memory.vars);
  }
  ,getVar:function(name,scope,ops){
    scope=scope||[0];
    ops=ops||{};
    var sc=this.getScope(scope);
    if(sc[name])return sc[name]
    else{
      if(!scope.length){
        if(!ops.noerr)throw "Diva:ReferenceError: "+name+" is not defined";
        return null;
      }
      return this.getVar(name,scope.slice(0,-1),ops);
    }
  }
  ,defVar:function(name,data,scope){
    var already=this.getVar(name,scope,{noerr:true});
    if(already&&already.type=="class")this.throw('ReferenceError','class '+name+' is already defined');
    var sc=this.getScope(scope);
    if(sc[name])this.throw('ReferencesError','variable '+name+' is already defined');
    var cla=this.getVar(data.type,scope,{noerr:true});
    if(!cla)this.throw('ReferenceError','class '+data.type+' is not defined');
    sc[name]={type:data.type,value:this.runFunc(cla.value.constructor,[],scope)}
  }
  ,forceType:function(v,type){
    var changer=this.toType;
    if(v.type==type)return v;//変換しない
    if(changer['[to]'][type]){
      return {type:type,value:this.runFunc(changer['[to]'][type],[v])};
    }
    var vt=v.type;
    var vtchanger=changer[vt];
    var rv=null;
    if(vtchanger&&vtchanger[type]){
      rv={type:type,value:this.runFunc(vtchanger[type],[v])};
    }
    if(rv)return rv;
    _this.throw("RuntimeError","変換出来ませんでした。");
  }
  
  ,isTrue:function(v){
    return this.forceType(v,'boolean').value==true;
  }
  ,getProperty:function self(obj,pn,scope){
    var type=obj.type;
    var obp=null;
    if(type=="class"||type=="array"){
      obp=(obj.value[type=="class"?"statics":"props"]||{})[pn]
    }else if(type=="struct"){
      if(!obj.value[pn])obj.value[pn]={type:'null'};
      obp=obj.value[pn];
    }else{
      obp=((this.getVar(type,scope).value||{}).props||{})[pn];
    }
    return obp||{type:'null'};
  }
  ,getClassList:function(scope){
    var _this=this;
    scope=scope||[0];
    var sc=this.getScope(scope);
    var rs=[];
    for(v in sc){
      if(sc[v]&&sc[v].type=="class")rs.push(v);
    }
    if(scope.length){
      [].push.apply(rs,_this.getClassList(scope.slice(0,-1)));
    }
    return rs;
  }
  ,toStr:function(obj){
    var value=obj.value;
    var type=obj.type;
    return _this.forceType(obj,"string").value;
  }
  ,parseStr:function(str,type){
    var rt="";
    str=str.replace(/\\n/g,"\n");
    if(type==1)rt=str.replace(/(\\')|(\\n)/g,"$1");
    else rt=str.replace(/\\"/g,'"');
    return rt.replace(/\\\\/g,"\\");
  }
  
  
  ,runFunc:function(func,args,scope){//関数実行
    if(func.native==true){//ネイティブ関数
      var rs=func.func(args,this,scope,func);
      if(typeof rs=='undefined'){
        rs={type:'null'};
      }
      if(func.rtype)rs=this.forceType(rs,func.rtype);
      return rs;
    }else{
      if(func.args.length){
        var nscope=_this.clone(scope);
        nscope.push("(f_"+func.name);//関数スコープ作成
        _this.getScope(scope)[nscope[nscope.length-1]]={};
        for(var ai=0;ai<func.args.length;ai++){
          var argv=args[ai]||{type:"null"};
          var ar=func.args[ai];
          if(ar.type)argv=_this.forceType(argv,ar.type);
          _this.defVar(ar.name,{type:argv.type},nscope);
          _this.getVar(ar.name,nscope).value=argv.value;
        }
      }
     var returnedValue=_this.process(func.code,nscope)||{type:"null"};
     if(func.rtype)returnedValue=this.forceType(returnedValue,func.rtype);
     return returnedValue;
    }
  }
  
,searchOperator:function(name,min){//演算子検索
  var opess=this.grammar.operator;
  for(var opes in opess){//0-n
    if(min&&opes<min)continue;
    for(var ope in opess[opes]){
      if(ope==name)return [opes,opess[opes][ope]];
    }
  }
  return null;
}
,opeList:function(v){
  var rt=[];
  var opess=this.grammar.operator;
  if(typeof v=="number"){
    for(var ope in opess[v]){
      rt.push(ope);
    }
    return rt;
  }
  
  for(var opes in opess){//0-n
    for(var ope in opess[opes]){
      rt.push(ope);
    }
  }
  return rt;
}


,clone:function clone(obj){
  if(typeof obj=='object'){
    if(!obj)return null;
    var robj={};
    if(Array.isArray(obj))robj=[];
    for(var key in obj)robj[key]=clone(obj[key]);
    return robj;
  }else return obj;
}

,toParts:function(code){
  var stack=[];
  var chars="";
  var _this=this;
  var str=[false,'',0];
  var operators=this.opeList();
  code.split('').forEach(function(v,i){
    if(str[0]){//文字列の中の時
      if(str[1]=="#"){
        if(v=="\n")stack.push(v);
        if((v=="\n"||v=="#")&&!str[2]%2){
          chars="";str[0]=false;str[1]='',str[2]=0;
        }
        if(v=="\\")str[2]++;
        else str[2]=0;
        return;
      }
      if(v==str[1]&&!str[2]%2){//文字列リテラル終了
        str[0]=false;str[1]='',str[2]=0;
        stack.push(["str",_this.parseStr(chars,v=='"'?2:1)]);
        chars="";
        return;
      }
      chars+=v;
      return;
    }
    var nchars=chars+v;
    if(v==" "||v=="　"||v=="\n"){
      if(chars)stack.push(chars);
      if(v=="\n")stack.push(v);
      chars='';return;
    }
    if(v=="'"||v=='"'||v=="#"){
      if(chars)stack.push(chars);
      str[0]=true;str[1]=v;chars='';
      return;
    }
    if(_this.grammar.symbol.indexOf(v)+1){
      if(chars)stack.push(chars);
      if(operators.indexOf(stack[stack.length-1]+v)+1)
        stack[stack.length-1]+=v;
      else stack.push(v);
      chars='';return;
    }
    chars+=v;
  });
  if(chars)stack.push(chars);
  return stack;
}


,makeTree:function(scope){
  var parts=this.toParts(this.code);
  var tr=this.parseBracket(parts);
  return this.parseStatement(tr,scope);
}
,parseStatement:function(code,scope){
  _this=this;
  var stack=[];
  var Statement=[];
  var syntax='';
  var depth=0;
  var tr=[];
  var last=[];
  var blockn=0;
  var defdata={};
  code.forEach(function(v,i){
    if(!v)return;
    if(Array.isArray(v)){
     if(!Statement.length){//文頭の時
       if(v[0]=="{"){
         stack.push(["block",blockn++,_this.parseStatement(v[1],scope)]);
         last=stack[stack.length-1];
         return;
       }
     }
     Statement.push(v);
     return;
    }
    if(!Statement.length){//文頭
      if(v=='if'&&syntax=="else"){
        last.push(v,_this.parseExpression([code[i+1]],scope));
        code[i+1]='';
        if(Array.isArray(code[i+2])&&code[i+2][0]=="{"){
          last.push([['block',blockn++,_this.parseStatement(code[i+2][1],scope)]]);
          syntax='';code[i+1]='';code[i+2]='';
        }
        return;
      }
      if(v=='if'||v=="while"){
        syntax=v;
        if(Array.isArray(code[i+2])&&code[i+2][0]=="{"){
          stack.push([v,_this.parseExpression([code[i+1]],scope),[['block',blockn++,_this.parseStatement(code[i+2][1],scope)]]]);
          last=stack[stack.length-1];
          syntax='';code[i+1]='';code[i+2]='';
        }
        return;
      }
      if(v=="def"){
        syntax=v;
        if(code[i+2]==":"){
          defdata.rtype=code[i+1];
          code[i+1]="";
          code[i+2]="def";
          return;
        }
        if(Array.isArray(code[i+3])&&code[i+3][0]=="{"){
          var name=code[i+1];
          var args=code[i+2];
          var parts=_this.parseStatement([code[i+3]],scope);
          _this.defVar(name,{type:"func"},scope);
          _this.getVar(name,scope).value={
            native:false,
            name:name,
            rtype:defdata.rtype,
            args:_this.parseArgs(args[1],scope),
            code:parts
          };
          Statement=[];defdata={};syntax='';code[i+1]='';code[i+2]='';code[i+3]='';
        }
        return;
      }
      if(v=="\n")return stack.push(v);
    }
    if(v=="else"){
      if(Statement.length)_this.throw('SyntaxError','Unexpected token else');
      if(last[0]=="if"){
        syntax="else";
        last.push('else');
        return;
      }
    }
    if(v=="return"&&!syntax){
      if(Statement.length)_this.throw('SyntaxError','Unexpected token return');
      syntax="return";
      return;
    }
    if(v==";"){
      if(syntax=='if'||syntax=='while'){
        Statement.push(v);
        stack.push([syntax,_this.parseExpression([Statement[0]],scope),_this.parseStatement(Statement.slice(1),scope)]);
        last=stack[stack.length-1];
        syntax='';
      }else
      if(syntax=='def'){
        Statement.push(v);
        var name=Statement[0];
        var args=Statement[1];
        var parts=_this.parseStatement(Statement.slice(2),scope);
        _this.defVar(name,{type:"func"},scope);
        _this.getVar(name,scope).value={
          native:false,
          name:name,
          rtype:defdata.rtype,
          args:_this.parseArgs(args[1],scope),
          code:parts
        };
        syntax='';defdata={};
      }else
      if(syntax=="else"){
        last.push([[';',_this.parseExpression(Statement,scope)]]);
        syntax='';
      }else if(syntax=="return"){
        stack.push(['return',_this.parseExpression(Statement,scope)]);
        last=stack[stack.length-1];
      }else{
        stack.push([';',_this.parseExpression(Statement,scope)]);
        last=stack[stack.length-1];
      }
      Statement=[];return;
    }
    if(v)Statement.push(v);
  })
  return stack;
}


,parseExpression:function(exp,scope){
  _this=_this||this;
  var assignOpe=_this.opeList(0);
  if(!Array.isArray(exp))return [[exp]];//配列以外はそのまま
  var stackc=[],rtc=[];
  exp.forEach(function(vc,ic){
    if(vc==","||(ic==exp.length-1&&(stackc.push(vc)||true))){
      var stack=[],rt=[];
      stackc.forEach(function(v,i){
        if(assignOpe.indexOf(v)+1){
          if(!stack.length)_this.throw('SyntaxError','Unexpected operator'+v);
          rt.push(_this.parseEval(stack));
          stack=[];
          rt.push(v);return;
        }
        if(Array.isArray(v)){
          if(v[0]=="("){
            return stack.push(['(',_this.parseExpression(v[1],scope)]);
          }else if(v[0]=="{"){
            return stack.push(_this.parseStruct(v[1]));
          }
        }
        stack.push(v);
      });
      if(stack.length)rt.push(_this.parseEval(stack,scope));
      if(rt.length&&!Array.isArray(rt[rt.length-1]))_this.throw('SyntaxError','Unexpected operator'+rt[rt.length-1]);
      rtc.push(rt);
      stackc=[];
      return;
    }
    stackc.push(vc);
  });
  
  return rtc; 
}


,parseEval:function(parts,scope){
  var stack=[];
  var _this=this;
  var ope=_this.grammar.operator;
  var DefProp=0;
  var defData={};
  var operators=_this.opeList();
  var classList=_this.getClassList(scope);
  parts.forEach(function(v,i){
    var last=stack[stack.length-1];
    if(v=='')return;
    if(DefProp==2){
      stack.push(v);
      return DefProp=0;
    }
    if(Array.isArray(v)){
      if(v[0]=="("){
        if(last&&last.type!="operator"){
          //if(last.type!="func")_this.throw('TypeError','not a function');
          stack.push({type:'operator',value:_this.searchOperator("=",1),list:true});
          stack.push(v[1]);
          return;
        }
        
        stack.push(v);
      }else
      if(v[0]=="str"){
        if(last&&last.type!="operator"){
        //if(last.type!="func")_this.throw('TypeError','not a function');
        stack.push({type:'operator',value:_this.searchOperator("=",1)});
        }
        stack.push({type:"string",value:v[1]});
      }else if(v[0]=="struct"){
        var obj={type:"struct",value:{}};
        for(var obji in v[1]){
          var objv=v[1][obji];
          obj.value[objv.key]=objv.value;
        }
        stack.push(obj);
      }
    }else
    if(v=="\n")return;
    else if(/^[0-9]+$/.test(v)){
      if(DefProp==1){
        _this.throw('ParseError','Unexpected number after '+last.type);
      }
      if(last&&last.type!="operator"){
        //if(last.type!="func")_this.throw('TypeError','not a function');
        stack.push({type:'operator',value:_this.searchOperator("=",1)});
      }
      if(parts[i+1]=="."&&/^[0-9]+$/.test(parts[i+2])){
        stack.push({type:'float',value:(v+'.'+parts[i+2])*1});
        parts[i+1]='';parts[i+2]='';
      }else{
        stack.push({type:'int',value:v*1});
      }
    }else
    if(operators.indexOf(v)+1){
      if(DefProp==3){
        // variable.+
      }else{
        var ope=_this.searchOperator(v);
        stack.push({type:'operator',value:ope});
        if(ope[1].type==-1)DefProp=2;
      }
    }else{
      if(DefProp==1){//int x
        /*_this.defVar(v,defData,scope);
        var val=_this.getVar(v,scope);
        if(defData.const){
          val.name=v;
          val.const=2;
        }*/
        //stack.push({type:"var",value:v});
        stack.push({type:"defVar",value:{name:v,defData:defData}});
        DefProp=0;
        defData={};
      }else
      if(DefProp==2){
        stack.push(v);
        return DefProp=0;
      }else{
        if(v=="const"){
          defData.const=true;
          return;
        }
        if(last&&last.type!="operator"){
         // if(last.type!="func")_this.throw('TypeError','not a function');
          stack.push({type:'operator',value:_this.searchOperator("=",1)});
        }
        if(classList.indexOf(v)+1){
          defData.type=v;
          DefProp=1;
        }else{
          stack.push({type:"var",value:v});
        }
      }
    }
    isProp=false;
  });
  if(Object.keys(defData).length)this.throw("ParseError","Nothing cannot be defined");
  return stack;
}
	

,parseBracket:function self(parts){
  var tree=[];
  var stack=[];
  var bracket=[];
  var depth=0;
  var _this=this;
  parts.forEach(function(v,i){
    if(depth){
      if(bracket.length&&v==bracket[1]&&!--depth){
        tree.push([bracket[0],_this.parseBracket(stack)]);
        stack=[];
        bracket=[];return;
      }
      if(bracket.length&&v==bracket[0])depth++;
      stack.push(v);
    }else{
      if(v=="{"||v=="("||v=="["){
        bracket=[v,v=="("?")":v=="{"?'}':']'];
        depth++;return;
      }
      if(v==")"||v=="}"||v=="]")_this.throw('SyntaxError');
      tree.push(v);
    }
  });
  if(depth)_this.throw('SyntaxError:');
  return tree;
}



,parseArgs:function(args,scope){
  var _this=this;
  var classList=_this.getClassList(scope);;
  var argarr=[];//returnする配列　
  var vinfo={};
  for(var i=0;i<args.length;i++){
    var argv=args[i];
    if(argv==","){
      argarr.push(vinfo);
      vinfo={};
      continue;
    }
    if(classList.indexOf(argv)+1){
      if(i&&args[i-1]!=",")_this.throw("SyntaxError","Unexpected "+argv);
      vinfo.type=argv;
    }else{
      if(vinfo.name){
        argarr.push(vinfo);
        vinfo.name=null;
      }
      vinfo.name=argv;
    }
  }
  argarr.push(vinfo);
  return argarr;
}

,'exec':function(code,scope,list){
  var _this=this;
  var rt=[];
  var assign=false;
  code.forEach(function(exp,i){
      var last=null;
      for(var n=exp.length-1;n>=0;n--){//右から処理
        part=exp[n];
        if(!Array.isArray(part)){//代入演算子のとき
          var assignOpe=_this.searchOperator(part);
          if(assignOpe&&assignOpe[0]==0){
            assign=assignOpe[1];
          }else{
            _this.throw('UnknownError','Unexpected operator '+part);
          }
        }else{
          set=_this.eval(part,scope);
          if(assign){
            _this.runFunc(assign,[set,last],scope);
          }
          last=set;
        }
      }
      rt.push(last);
  });
  return list?rt:rt[rt.length-1];
}


,parseStruct:function(parts,scope){
  var _this=this;
  var obj=[];
  var type="key";
  var ops={};
  var valstack=[];
  for(var i=0;i<=parts.length;i++){
    var v=i==parts.length?",":parts[i];
    if(!v)break;
    if(v==","){
      ops.value=valstack.length?_this.parseExpression(valstack,scope)[0][0]:["null"];
      obj.push(ops);
      ops={};valstack=[];
      type="key";
    }else
    if(type=="key"){
      if(Array.isArray(v)){
      
      }else{
        if(v=="public"){
          ops.scope="public";
        }else if(v==":"){
          type="value";
        }else{
          ops.key=v;
        }
      }
    }else{
        valstack.push(v);
    }
  }
  return ["struct",obj];
}

,'eval':function(stack,scope){
  var _this=this;
  var ope=_this.grammar.operator;
  var newStack=[];
  var opStatus=0;
  var opobj={};
  var flist=false;
  var conV=function(v){
    return (Array.isArray(v)&&v[0]=="(")?_this.exec(v[1],scope):
           (v&&v.type=="var")?_this.getVar(v.value,scope):
           (v&&v.type=="defVar")?(_this.defVar(v.value.name,v.value.defData,scope),_this.getVar(v.value.name,scope)):
           (v&&v.type=="struct")?(function(){
             for(prop in v.value){
               v.value[prop]=_this.eval(v.value[prop],scope);
             }
             return v;
           })():v;
  };
  for(var opi=1;opi<ope.length;opi++){
    var ops=ope[opi];
    stack.forEach(function(v,i){
      if(!v)return;
      if(v.type=="operator"){
        if(v.value[0]==opi){
           opobj=v.value[1];
           var last=stack[i-1];
           var next=stack[i+1];
          if(opobj.type&1&&last&&(!next||next.type=="operator")){//後置
            newStack[newStack.length-1]=_this.runFunc(opobj,[conV(newStack[newStack.length-1]),null],scope)||{type:'null'};
          }else
          if((opobj.type&2||opobj.type==-2)&&i&&next){ //中置演算子
            opStatus=1;
            if(opobj.list&&!v.list)flist=true;
            return;
          }else
          if(opobj.type&4&&next&&next.type!="operator"){//前置演算子
            newStack.push(_this.runFunc(opobj,[null,conV(next)],scope)||{type:'null'});
            stack[i+1]=null;
          }else{
            _this.throw("SyntaxError","Unexpected operator");
          }
        }else{
          newStack.push(v);
        }
      }else{
        if(opStatus){
          if(opobj.type==-2)v=v.value;
          else if(opobj.list){
            if(Array.isArray(v))v=_this.exec(v,scope,true);
            else v=[conV(v)];
          }else v=conV(v)
          newStack[(newStack.length||1)-1]=_this.runFunc(opobj,[conV(newStack[newStack.length-1]),v],scope)||{type:'null'};
          flist=false;
          opStatus=0;
          opobj={};
        }else{
          newStack.push(v);
        }
      }
      opStatus=0;
    });
    stack=newStack; //stack更新
    newStack=[];
    
  }
  return conV(stack[0]);
}

,'throw':function(errtype,errtxt){
  var errstr=errtype+':'+errtxt;
  this.stderr+="Diva:"+errstr+"\n";
  throw errstr;
}
};