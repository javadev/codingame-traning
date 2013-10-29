// The Resistance
#include<iostream>
#include<vector>
#include<string>
#include<map>

using namespace std;

typedef long long ll;

const vector<string> translate{
  ".-", "-...", "-.-.", "-..",
    ".", "..-.", "--.", "....",
    "..", ".---", "-.-", ".-..",
    "--", "-.", "---", ".--.",
    "--.-", ".-.", "...", "-",
    "..-", "...-", ".--", "-..-",
    "-.--", "--.."};

string morse(const string & s){
  string res="";
  for(char c : s)
    res+=translate[c-'A'];
  return res;
}

map<string, int> morse_word;

ll aux(int start, const string & l, vector<ll> & mem){
  if(start==int(l.size())) return 1;
  if(mem[start]!=-1) return mem[start];

  ll res=0;
  for(int i=1;i<20*4 && start+i<=int(l.size()); ++i){
    auto word = morse_word.find(l.substr(start, i));
    if(word!=end(morse_word))
      res+=word->second*aux(start+i, l, mem);
  }

  mem[start]=res;
  return res;
}

int main(){
  string l;
  int n;
  cin >> l >> n;
  cin.ignore();
  for(int i=0;i<n;++i){
    string tmp;
    getline(cin, tmp);
    morse_word[morse(tmp)]++;
  }

  vector<long long> mem(l.size(),-1);
  cout << aux(0,l,mem) << '\n';

}
