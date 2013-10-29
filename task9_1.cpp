// Conway Sequence
#include<iostream>
#include<vector>

using namespace std;

void next(vector<int> & t){
  vector<int> tmp;
  int val=t[0];
  int nb=1;
  for(int i=1;i<int(t.size());++i){
    if(t[i]==val)
      nb++;
    else{
      tmp.push_back(nb);
      tmp.push_back(val);
      val=t[i];
      nb=1;
    }
  }
  tmp.push_back(nb);
  tmp.push_back(val);
  t=tmp;
}

int main(){
  int n, l;
  cin >> n >> l;
  vector<int> t{n};
  for(int i=1;i<l;++i)
    next(t);

  cout << t[0];
  for(int i=1;i<int(t.size());++i)
    cout << ' ' << t[i];
}
