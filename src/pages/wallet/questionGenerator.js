const getRandomFromArray = (array, n) => {
  const arrayClone = [...array];
  const result = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * arrayClone.length);
    result.push(arrayClone.splice(randomIndex, 1));
  }
  return result;
};
const generateOptions = (array, n) => {
  const arrayClone = [...array];
  const itemN = arrayClone.splice(n, 1);
  const options = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * arrayClone.length);
    options.push(arrayClone.splice(randomIndex, 1));
  }
  const insertIndex = Math.floor(Math.random() * options.length);
  options.splice(insertIndex, 0, itemN);
  return {
    answer: insertIndex,
    options,
  };
};
const questionGenerator = {
  getQuestions: (originArr) => {
    const questionTitles = [];
    for (let i = 0; i < 12; i++) {
      questionTitles.push(i);
    }
    const randomQuestionTitle = getRandomFromArray(questionTitles, 3);
    return randomQuestionTitle.map((item, index) => {
      const { answer, options } = generateOptions(originArr, item);
      return {
        no: index,
        title: Number(item) + 1,
        answer,
        options,
      };
    });
  },
};
export default questionGenerator;
