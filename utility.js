import query from "./data/search";
import {constants, dummyData} from "./constants";

const intersectArray = (array1, array2) => array1.filter(value => array2.includes(value));

const intersectArrayOfObjects = (array1, array2) => array1.filter(obj1 => !array2.some(obj2 => obj1.id === obj2.id));

function removeDuplicateObjects(array) {
  const result = array.filter((item, index, self) =>
      self.some((other) => other.id === item.id && other.type === item.type)
  );
  return result
}

function compareWords(userInputtedWord, listedWord) {

  let maxPoints = 0;
  let points = 0;
  let userInputtedWordLetters = [];
  let listedWordLetters = [];
  let smallestWord = (userInputtedWord.length >= listedWord.length) ? listedWord : userInputtedWord

  if (Math.abs(userInputtedWord.length - listedWord.length) > 2) {
    return 0;
  } else if (userInputtedWord.length === listedWord.length) {
    maxPoints += 0.5;
    points += 0.5;
  }

  for (let i = 0 ; i < smallestWord.length ; i++) {

    let inputtedLetter = userInputtedWord[i].toLowerCase();
    let listedLetter = listedWord[i].toLowerCase();

    userInputtedWordLetters.push(inputtedLetter);
    listedWordLetters.push(listedLetter);

    if (inputtedLetter === listedLetter) {
      maxPoints += 3;
      points += 3;

    } else if (i > 0) {

      // Check for reversals
      if (userInputtedWord[i - 1].toLowerCase() === listedLetter && listedWord[i - 1].toLowerCase() === inputtedLetter) {
        maxPoints += 1;
        points += 1;
      } else {
        maxPoints += 1;
        if (i < smallestWord.length - 1) {
          if (userInputtedWord[i + 1].toLowerCase() === listedLetter && listedWord[i + 1].toLowerCase() === inputtedLetter) {
            maxPoints += 1;
            points += 1;
          } else {
            maxPoints += 0.5;
          }
        }
      }
    }
  }
  maxPoints += Math.abs(intersectArray(userInputtedWordLetters, listedWordLetters).length - smallestWord.length) / 2;

  if (maxPoints > 0) {
    return (points / maxPoints);
  }
}

export const searchForResults = (input, codesToSearch = dummyData.codigos_to_search) => {

  let perf_beginning = performance.now()
  const queryWords = []
  const dictWords = {}
  let unwantedWords = ['a', 'e', 'o', 'da', 'de', 'do', 'em', ' que', 'no', 'nos', 'das', 'dos', 'ao', 'ou', 'à', '', ' ']
  // Compares Words
  input.split(' ').map((inputtedWord) => {
    if (unwantedWords.includes(inputtedWord)) {
      return null;
    }
    dictWords[inputtedWord] = [];
    query.words.map((word) => {
      const result = compareWords(inputtedWord, word) * 100;
      if (result > 80 && inputtedWord.length > 2) {
        if (!queryWords.includes(word)) {
          queryWords.push(word);
          dictWords[inputtedWord].push(word)
        }
      }
    })
  })

  const items = []
  let reducedIndex = 0;

  // Gets the items from query based on words gotten above
  input.split(' ').map((key, index) => {
    if (unwantedWords.includes(key)) {
      reducedIndex = reducedIndex + 1;
      return null;
    }
    items.push([])
    dictWords[key].map((word) => {
      query.articles[word].map((item) => {
        if (codesToSearch.some(code => code.code === item.type)) {
          if (item.id) {
            items[index - reducedIndex].push(item)
          } else {
            item.map((subitem) => {
              items[index - reducedIndex].push(subitem)
            })
          }
        }
      })
    })
  })

  const IDs = []
  let matches = []

  const articleCount = {CC: 0, CPC: 0, CRP: 0, CP: 0}

  // Eliminates doubles and gets matches
  if (items.length > 1) {
    for (let i=0; i < items.length; i++) {
      items[i].map((item) => {
        if (IDs.includes(item.id)) {
          matches.push(item)
        } else {
          IDs.push(item.id)
        }
      })
    }
  } else {
    matches = items[0]
  }

  if (matches) {
    matches = removeDuplicateObjects(matches)
  }

  matches && matches.map(article => articleCount[article.type]++)

  const perf_end = performance.now()
  return {matches: (matches === undefined ? [] : matches), articleCount: articleCount, execTime: perf_end - perf_beginning}
}

export const r1 = searchForResults("direito")
