// Network Cabling
#include<iostream>
#include<vector>
#include<algorithm>

using namespace std;

typedef pair<int, int> pi;

int main(){
  ios::sync_with_stdio(false);
  int n;
  cin >> n;
  vector<pi> t(n);
  for(int i=0;i<n;++i)
    cin >> t[i].second >> t[i].first;
  sort(begin(t), end(t));
  int yres=t[n/2].first;

  long long res=0;
  int maxi=t[0].second, mini=t[0].second;
    for(int i=0;i<n;++i){
      maxi=max(maxi, t[i].second);
      mini=min(mini, t[i].second);
      res+=abs(t[i].first-yres);
    }

    res+=maxi-mini;
    cout << res;
}
