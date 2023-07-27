// export default function randomGen(max, howMany, alreadyUsed) {
//   const randomArray = [];
//   const isValidAndUnique = (item) => {
//     return !randomArray.includes(item) && item !== alreadyUsed;
//   };

//   const generateRandomItem = () => {
//     console.log('strating', max)
//     const item = Math.floor(Math.random() * max);

//     if (isValidAndUnique(item)) {
//         randomArray.push(item);

//       if (randomArray.length === howMany) {
//         console.log(randomArray)
//         return randomArray
//       }
    
//     return generateRandomItem()
//     }
//   };

//   return generateRandomItem();
// }


export default function randomGen(max, howMany, alreadyUsed) {
    return new Promise((resolve, reject) => {
      const randomArray = [];
      console.log(max)
  
      // Helper function to check if the item is valid and unique
      const isValidAndUnique = (item) => {
        return !randomArray.includes(item) && item !== alreadyUsed;
      };
  
      const generateRandomItem = () => {
        const item = Math.floor(Math.random() * max);
  
        if (isValidAndUnique(item)) {
            console.log(item, alreadyUsed, randomArray);
            randomArray.push(item);
  
          if (randomArray.length === howMany) {
            console.log(true, randomArray)
            clearInterval(intervalId); // Stop the interval once the array is complete
            resolve(randomArray);
          }
        }
      };
  
      const intervalId = setInterval(generateRandomItem, 1);
    });
  }
  