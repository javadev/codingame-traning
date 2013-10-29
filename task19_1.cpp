// Surface
#include<iostream>
#include<vector>
#include<queue>

using namespace std;

typedef pair<int, int> pi;

int L,H;
int nb_comp = 0;

const vector<pi> dir{pi{1,0}, pi{-1,0}, pi{0,1}, pi{0,-1}};

void mark(int x,int y, const vector<vector<char> >& t, vector<vector<int> >& comp){
  comp[x][y]=nb_comp;
  queue<pi> q;
  q.push(pi(x,y));
  while(!q.empty()){
    pi curr = q.front();
    q.pop();
    for(pi p:dir){
      pi nv = pi(curr.first+p.first, curr.second+p.second);
      if(nv.first>=0 && nv.first<L &&
        nv.second>=0 && nv.second<H &&
        t[nv.first][nv.second]=='O' &&
        comp[nv.first][nv.second]==-1){
            q.push(nv);
            comp[nv.first][nv.second]=nb_comp;
      }
    }
  }
}

int main(){
  cin >> H >> L;
  vector<vector<char> > t(L, vector<char>(H));
  vector<vector<int> > comp(L, vector<int>(H,-1));

  for(int i=0;i<L;++i)
    for(int j=0;j<H;++j)
      cin >> t[i][j];

  for(int i=0;i<L;++i)
    for(int j=0;j<H;++j)
      if(comp[i][j]==-1 && t[i][j]=='O'){
        mark(i,j,t,comp);
        nb_comp++;
      }

  vector<int> res(nb_comp+1,0);
  for(int i=0;i<L;++i)
    for(int j=0;j<H;++j)
      if(comp[i][j]!=-1)
        res[comp[i][j]]++;

  int N;
  cin >> N;
  for(int i=0;i<N;++i){
    int x,y;
    cin >> y >> x;
    if(t[x][y]=='#')
      cout << 0 << '\n';
    else
      cout << res[comp[x][y]] << '\n';
  }
}
