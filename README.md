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
time[1];//パース時間(ms)
/*但し、エラー時は*/
time;//null
```
# 文法
文末にセミコロン必須。完全なブロックスコープ
```Python
int i=6;
float a=3.287;
complex c=3+2*I;#複素数
string s="hoge";# " か '
struct o={
　 p:"property"
};
o.p;#"property"

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
```
