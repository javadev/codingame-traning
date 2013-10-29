-- Genome Sequencing 
import Control.Monad
import Data.List
import Data.Maybe
 
compact :: [String]  -> String
compact ls = foldl merge [] ls
        where merge l1 l2 = head $ mapMaybe (overlap l1 l2) [0..length l1]
 
overlap :: String -> String -> Int -> Maybe String
overlap l1 l2 i =
        let (prefix, suffix) = splitAt i l1 in
        if and (zipWith (==) suffix l2)
            then Just (prefix ++ l2 ++ drop (length l2) suffix)
            else Nothing
 
main :: IO ()
main = do
        n <- readLn
        solutions <- fmap (map compact . permutations) (forM [1..n] (const getLine))
        putStrLn $ show (minimum (map length solutions))

