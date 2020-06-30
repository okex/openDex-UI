// 从数组中随机选取n个元素
const getRandomFromArray = (array, n) => {
  const arrayClone = [...array];
  const result = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * arrayClone.length);
    result.push(arrayClone.splice(randomIndex, 1));
  }
  return result;
};
// 生成4个备选项,其中必须包含第n项
const generateOptions = (array, n) => {
  const arrayClone = [...array];
  // 第n项
  const itemN = arrayClone.splice(n, 1);
  const options = [];
  // 生成剩余的3项
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * arrayClone.length);
    options.push(arrayClone.splice(randomIndex, 1));
  }
  // 插入n
  const insertIndex = Math.floor(Math.random() * options.length);
  options.splice(insertIndex, 0, itemN);
  return {
    answer: insertIndex,
    options
  };
};
const questionGenerator = {
  getQuestions: (originArr) => {
    const questionTitles = [];
    for (let i = 0; i < 12; i++) {
      questionTitles.push(i);
    }
    // 随机选择3个问题序号
    const randomQuestionTitle = getRandomFromArray(questionTitles, 3);
    return randomQuestionTitle.map((item, index) => {
      const { answer, options } = generateOptions(originArr, item);
      return {
        no: index, // 问题序号
        title: Number(item) + 1, // 题目中出现的编号x
        answer, // 正确答案
        options // 备选项
      };
    });
  }
};
export default questionGenerator;
