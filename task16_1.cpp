// CGX Formatter
#include<iostream>

using namespace std;

int indent=0;
bool nline=true;

void print_indent(){
  if(nline)
    for(int i=0;i<indent;++i)
      cout << "    ";
  nline=false;
}

int main(){
  int n;
  cin >> n;
  bool quote=false;
  char c;
  cin >> noskipws;
  while(cin >> c){
      if(quote){
          quote=(c!='\'');
          cout << c;
      }
      else switch(c){
      case ' ':
      case '\t':
      case '\n':
          break;
      case ';':
          cout << ";\n";
          nline=true;
          break;
      case '(':
          if(!nline){
          cout << '\n';
          nline=true;
          }
          print_indent();
          ++indent;
          cout << "(\n";
          nline=true;
          break;
      case ')':
          if(!nline){
          cout << '\n';
          nline=true;
          }
          --indent;
          print_indent();
          cout << c;
          break;
      case '\'':
          quote=true;
          print_indent();
          cout << c;
          break;
      default:
          print_indent();
          cout << c;
      }
  }
}
