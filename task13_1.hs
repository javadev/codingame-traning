-- Scrabble
import Data.List (find,sort,minimumBy)
import Control.Monad (replicateM)
import Control.Applicative((<$>))
import Data.Ord (comparing)
 
scores = [("eaionrtlsu",1) , ("dg",2) , ("bcmp",3) , ("fhvwy",4)
         ,("k",5) , ("jx",8) , ("qz",10) ]
 
score :: String -> Maybe Int
score w = fmap sum $ sequence $ (map score') w
   where score' c =  fmap snd $ find (\(s,_) -> c `elem` s) scores
 
   
--assuming letters and word in alphabetical order.
possible' _ [] = True
possible'  [] _ = False
possible' (l:ls) wo@(w:ws)
   | l == w    = possible' ls ws
   | l < w     = possible' ls wo
   | otherwise = False
   
possible l w = possible' (sort l) (sort w)
 
main :: IO ()
main = do
    n <- readLn :: IO Int
    dico <- replicateM n getLine :: IO [String]
    letters <- getLine :: IO String
    putStrLn $ minimumBy (flip $ comparing score) $ filter (possible letters) dico

