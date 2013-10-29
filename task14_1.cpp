// Super Computer
#include<iostream>
#include<vector>
#include<algorithm>

using namespace std;

typedef pair<int, int> pi;

bool my_sort(const pi & a, const pi & b){
  return a.second<b.second;
}

int main(){
  int n;
  cin >> n;
  vector<pi> t;
  for(int i=0;i<n;++i){
    int a, b;
    cin >> a >> b;
    t.push_back(pi(a,a+b-1));
  }

  sort(t.begin(), t.end(), my_sort);

  int res=0;
  int use_until=-1;
  for(auto event:t)
    if(use_until<event.first){
      use_until=event.second;
      res++;
    }
  cout << res;
}
