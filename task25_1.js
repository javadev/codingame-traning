/* 	
To rest from his stressful last adventure, Doctor Who decides to attend a music recital performed by Her Majesty the Queen’s Royal Orchestra. Since he doesn’t want to be seen in public, the Doctor uses the TARDIS to channel the music directly from the Opera to his home.

But behold! The infamous Graske has detected an opportunity to do evil: the sound waves channelled by the TARDIS have created a space-time crack that the alien is using to travel through dimensions. He should soon reach Earth and annihilate the human race. Nothing less could have been expected from this vile creature!

The Doctor soon realizes that the only way to prevent this terrible fate is to make the TARDIS play the melodies backwards. This will reverse the polarity of the neutron flow and banish the Graske to the other side of the universe.

Unfortunately the melodies are only available on musical scores on paper and the TARDIS is not (yet) equipped with a score reader.

Your mission is to help Doctor Who defeat the Graske. To do so, you have to implement an interface that can read scanned musical scores directly from paper and translate them into musical notes.
 
The musical scores are fairly simple and only feature half notes () and quarter notes (). Notes are all represented on a staff and are limited to the following musical notes (either half or quarter):

Notes are labelled using the English convention: A B C D E F and G

As a reminder (for those not familiar with reading music):

    On a score, a "staff" always contains 5 lines. Notes are either located accross a line or between two lines.
    The first C note is located on a specific segment - a ledger line - below the 5 other lines.
    The notes have tails which can either go up - until the first A - or down - from the second C. The tail of the B can go either way.
    The label of a note (A, B, C, etc.) is independant of whether the note is a half or quarter note.

You are provided with scanned images of the scores in black and white encoded in a simple, yet efficient, form of RLE (Run-Length Encoding): the DWE (Doctor Who Encoding) algorithm.
In the DWE, consecutive pixels of the same color are encoded using a letter (B for black pixels, W for white pixels) followed by a space followed by the number of pixels of that color.

For example: W 5 B 20 W 16 means 5 white pixels, followed by 20 black pixels, followed by 16 white pixels.

Encoding is done from top to bottom. When the image width is known, reconstructing the original image is straightforward.
 
Within the images, the scores and notes have various sizes. To fully understand the challenge at hand, you should check all the images from this    page  . They correspond to the challenge tests further down. 

All the test cases are contained within these 12 images and if your code can process them all, then you are good to go!
INPUT:
Line 1: the width W and height H of the image in pixels.
Line 2: the image encoded from top to bottom using the DWE algorithm: several couples of "C L" separated by spaces. C is the color of the pixels (either B for black or W for white), L is the number of contiguous pixels of the same color (may encompass multiple image lines).
 
OUTPUT:
Notes read from left to right separated by space characters.
Each note is composed of two characters. First the note itself: A B C D E F or G. Then its type: H for a half note or Q for a quarter note. There is no distinction between the first C and the second C (same goes for D, E, F, G).
 
CONSTRAINTS:
100 < W < 5000
70 < H < 300
Lines and tails have a width of at least 1 pixel.
Notes are separated by at least 1 pixel.
The space between two lines is at least 8 pixels wide and at least 4 times the width of a line.
 
EXAMPLE:
Input
120 176
W 4090 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 1020 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 26 B 10 W 82 B 2 W 25 B 12 W 81 B 2 W 23 B 4 W 8 B 4 W 79 B 2 W 23 B 2 W 12 B 2 W 79 B 2 W 22 B 2 W 14 B 2 W 78 B 2 W 21 B 3 W 14 B 3 W 77 B 2 W 21 B 2 W 16 B 2 W 77 B 2 W 20 B 3 W 16 B 3 W 36 B 64 W 18 B 18 W 20 B 64 W 18 B 18 W 20 B 64 W 18 B 18 W 20 B 64 W 18 B 18 W 60 B 2 W 20 B 2 W 18 B 2 W 76 B 2 W 20 B 3 W 16 B 3 W 76 B 2 W 20 B 3 W 16 B 2 W 77 B 2 W 20 B 4 W 14 B 3 W 77 B 2 W 20 B 4 W 14 B 2 W 78 B 2 W 20 B 2 W 1 B 2 W 12 B 2 W 79 B 2 W 20 B 2 W 1 B 4 W 8 B 4 W 79 B 2 W 20 B 2 W 3 B 12 W 81 B 2 W 20 B 2 W 4 B 10 W 82 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 56 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 46 B 10 W 4 B 2 W 20 B 2 W 81 B 12 W 3 B 2 W 20 B 2 W 79 B 16 W 1 B 2 W 20 B 2 W 79 B 16 W 1 B 2 W 20 B 2 W 78 B 20 W 20 B 2 W 77 B 21 W 20 B 2 W 77 B 21 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 77 B 20 W 21 B 2 W 77 B 20 W 21 B 2 W 78 B 18 W 22 B 2 W 79 B 16 W 23 B 2 W 79 B 16 W 23 B 2 W 81 B 12 W 25 B 2 W 56 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 2420 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 5050
	
Output
AQ DH
 
Available RAM : 512MB
Timeout: 6 seconds

    The program has to read inputs from standard input
    The program has to write the solution to standard output
    The program must run in the test environment

Download the files provided in the test script:
One quarter note between lines: in1.txt out1.txt
One quarter note on a line: in2.txt out2.txt
One half note between lines: in3.txt out3.txt
One half note on a line: in4.txt out4.txt
Only quarter notes without lower C: in5.txt out5.txt
Only half notes without lower C: in6.txt out6.txt
Scale half and quarter notes: in7.txt out7.txt
Lower C: in8.txt out8.txt
Very close: in9.txt out9.txt
Only 1 pixel wide: in10.txt out10.txt
Doctor Who theme: in11.txt out11.txt
Random: in12.txt out12.txt
*/
// Read inputs from Standard Input (use readline()).
// Write outputs to Standard Output (use print()).

var DEBUG = false;

var debug = function(a){
    if(DEBUG){
        print(a.toSource())
    }
}

var t = readline().split(" ");
var W = parseInt(t[0]);
var H = parseInt(t[1]);

var c = readline().split(" ");

var I = [];
var RI = [];
for(var i = 0; i < H; i++){
    I.push([]);
    RI.push([]);
}

var x = 0;
var y = 0;
var addColor = function(color){
    I[y].push(color);
    x ++;
    if(x === W){
        y++;
        x = 0;
    }
}

var sum = 0;
var ry = 0;
var addRLE = function(color, length){
    if(length > W - sum){
        RI[ry].push({color:color, size: W - sum, start:sum});
        ry ++;
        sum2 = sum
        sum = 0;
        addRLE(color, length - (W - sum2));
    }else{
        RI[ry].push({color:color, size:length, start:sum})
        sum += length
    }
}


for(var i = 0; i < c.length; i += 2){
    var color = c[i] == "B";
    var length = parseInt(c[i + 1])
    for(var j = length; j --> 0;){
        addColor(color);
    }
    addRLE(color, length);
}

var track = I.map(function(line){
    var count = 0;
    for(var i = 0; i < line.length; i++){
        if(line[i]){
            count ++;
        }
    }
    return count > line.length / 2
})

var trackBounds = (function(){
    var inside = false;
    var currentStart = -1;
    var res = [];
    for(var i = 0; i < track.length; i++){
        if(track[i] && !inside){
            currentStart = i;
            inside = true;
        }
        if(!track[i] && inside){
            res.push({
                start:currentStart,
                end:i,
                size:i - currentStart
            })
            inside = false
        }
    }
    if(inside){
        res.push({
            start:currentStart,
            end:i,
            size:i - start
        })
    }
    return res;
})()

var trackSize = (function(bounds){
    var sizes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(var i = 0; i < bounds.length; i++){
        sizes[bounds[i].size] ++;
    }
    var maxi = 0;
    for(var i = 1; i < sizes.length; i++){
        if(sizes[i] > sizes[maxi]){
            maxi = i
        }
    }
    return maxi
})(trackBounds)

if(trackBounds.length != 5){
    trackBounds = trackBounds.filter(function(a){
        return a.size == trackSize;
    })
}

if(trackBounds.length != 5){
    print("I have more than 5 tracks, not supposed to happen");
}

var interTrack = (trackBounds[1].start - trackBounds[0].end)

var doLine = function(lineIndex, index, thresMin, thresMax, filter){
    var line = RI[lineIndex]
    var res = []
    for(var j = 0; j < line.length; j++){
        if(line[j].size >= thresMin && line[j].size < thresMax){
            debug(line[j])
            if(filter(line[j], lineIndex, index)){
                res.push({color:line[j].color, start: line[j].start, index:index})
                if(line[j].color){
                    j++
                }else{
                    j += 2
                }
            }
        }
    }
    return res;
}

var thresMin = Math.floor(interTrack / 4 * 2.5);
var thresMax = Math.floor(interTrack / 4 * 6);
var notes = [];

var eps = Math.floor(interTrack / 5)

var checkInterTrack = function(c, index){
    var x = Math.floor(c.start + c.size / 2)
    if(trackSize != 1){
        for(var y = index + eps; y < H; y++){
            if (track[y]){
                return false;
            }
            if (I[y][x]) break;
        }
    }
    for(var y = index - eps; y -->0;){
        if (track[y]){
            return false;
        }
        if (I[y][x]) break;
    }
    if(I[index + eps][x] != c.color) return false;
    if(I[index - eps][x] != c.color) return false;
    return true;
}

var checkInterTrack2 = function(c, index){
    var x = Math.floor(c.start + c.size / 2)
    for(var y = index + eps; y < H; y++){
        if (track[y]){
            return false;
        }
        if (I[y][x]) break;
    }
    for(var y = index - eps; y -->0;){
        if (track[y]){
            return false;
        }
        if (I[y][x]) break;
    }
    if(I[index + eps][x] != c.color) return false;
    if(I[index - eps][x] != c.color) return false;
    return true;
}

var checkTrack = function(c, lineIndex, index){
    var t = trackBounds[(index - 1) / 2];
    var x = Math.floor(c.start + c.size / 2);
    for(var y = t.end + eps; y < H; y++){
        if (track[y]){
            return false;
        }
        if (I[y][x]) break;
    }
    for(var y = t.start - eps; y -->0;){
        if (track[y]){
            return false;
        }
        if (I[y][x]) break;
    }
    if(I[t.end + eps][x] != c.color) return false;
    if(I[t.start - eps][x] != c.color) return false;
    return true;
}

//On the tracks
for(var i = 0; i < 5; i++){
    notes = notes.concat(
        doLine(trackBounds[i].start - 1,
        i * 2 + 1, thresMin, thresMax, checkTrack));
}

//Intertrack before the tracks
for(var i = 0; i < 5; i++){
    notes = notes.concat(
        doLine(trackBounds[i].start - Math.floor(interTrack / 2),
        i * 2, thresMin, thresMax, checkInterTrack));
}

//last intertracks
notes = notes.concat(
    doLine(trackBounds[4].start + Math.floor(interTrack / 2),
    10,thresMin, thresMax, checkInterTrack));
notes = notes.concat(
    doLine(trackBounds[4].start + interTrack + Math.floor(interTrack / 4),
    11, thresMin, thresMax * 2, checkInterTrack2));


var names = ["G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"]

notes.sort(function(a, b){
    if(a.start < b.start) return -1;
    if(a.start > b.start) return 1;
    return 0;
})

var res = notes.map(function(n){
    return names[n.index] + (n.color?"Q":"H")
})
/*
BQ    DH    FQ GQ GQ BQ DH BQ BQ    DH    FQ GQ GQ BQ DH BQ
BQ CH DH EH FQ GQ GQ BQ DH BQ BQ CH DH EH FQ GQ GQ BQ DH BQ
*/
print(res.join(" "))

debug(trackBounds);
debug(trackSize)
debug(interTrack)
debug(notes)
