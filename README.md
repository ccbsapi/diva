# diva
JavaScriptで作られた激遅インタプリタ。
# 使い方
<code>diva.js</code>を読み込み、
```JavaScript
var diva=new Diva("コード");//Divaオブジェクトを作成
var time=diva.run();
diva.stdout;//出力
diva.stderr;//エラー
time[0];//パース時間(ms)
time[1];//実行時間(ms)
/*但し、エラー時は*/
time;//null
```
# 文法
文末にセミコロン必須。関数、ブロックスコープ。
コメントは<code>#</code>から改行若しくは<code>#</code>まで。
<code>\\</code>を前に置くと改行or<code>#</code>判定を避けられる。
```Python
int i=6;
float a=3.287;
complex c=3+2*I;#複素数
string s="hoge";# " か '
struct o={
　 p:"property"
};
o.p;#"property"

array arr=[1,3,5];
print(arr[1*2]);#5

i++;
#ここはコメント\
複数行コメント#

int i2=6.5;#6(強制型変換)
if true print 0;
else if(false){print 1;}

while(i++<10)print i;

print s;#引数が1トークンの場合は()は省略可能
print(s*2);

def add(int a,b){#引数には型を指定できる
  return a+b;
}
def float:abs(a)return sqrt(a**2);
#戻り値の型を指定可能

#組み込み変数(関数)

true;#boolean
false;#boolean
null;#null

PI;#float
E;#float
I;#complex

print();#any
if();#any
sqrt();#int,float,complex
log();#int,float,complex
sin();#int,float,complex
cos();#int,float,complex
tan();#int,float,complex
sinh();#int,float,complex
cosh();#int,float,complex

```

# divac.html
aceエディタを使ったオンライン実行、編集ページ
divac.html内で使える関数:
```Python
atan();#int,float
plot();#[\
  function<func>    \
 ,min-x<int|float>  \
 ,max-x<int|float>  \
 ,min-y<int|float>  \
 ,max-y<int|float>  \
(,画質-x(px)<int|float>)\
]#

#Example:
plot(sin,-8,8,-3,3);
```
