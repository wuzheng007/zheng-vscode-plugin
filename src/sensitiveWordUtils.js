class SensitiveWordUtils {
    constructor() {
        // 最小匹配类型
        this.minMatchType = 1;

        // 最大匹配类型
        this.maxMatchType = 2;
    }

    /**
     * @description: 构建一个包含敏感词和白名单的关键词Map
     * @param {Array} sensitiveWords 敏感词列表
     * @return {Object} 关键词Map
     */
    initKeyWordAndWhiteList(sensitiveWords) {
        if (!sensitiveWords || sensitiveWords.length === 0) {
            return null;
        }

        try {
            let keyWordSet = new Set();
            sensitiveWords.forEach(word => {
                keyWordSet.add(word.trim());
            });

            return this.addSensitiveWordAndWhiteListToHashMap(keyWordSet);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    // 构建关键词Map的私有辅助方法
    addSensitiveWordAndWhiteListToHashMap(keyWordSet) {
        let sensitiveWordMap = {};

        keyWordSet.forEach(key => {
            let nowMap = sensitiveWordMap;
            for (let i = 0; i < key.length; i++) {
                let keyChar = key[i];

                if (nowMap[keyChar]) {
                    nowMap = nowMap[keyChar];
                } else {
                    let newWorMap = { isEnd: "0" };
                    nowMap[keyChar] = newWorMap;
                    nowMap = newWorMap;
                }

                if (i === key.length - 1) {
                    nowMap.isEnd = "1";
                }
            }
        });

        return sensitiveWordMap;
    }

    /**
     * @description: 在文本中匹配敏感词
     * @param {string} text 文本内容
     * @param {Object} sensitiveWordMap 关键词Map
     * @param {Object} wordMap 敏感词Map
     * @param {Object} wordWhiteMap 白名单Map
     * @param {number} ignoreCase 是否忽略大小写 0否 1是
     * @param {number} specialScanWay 是否精准扫描 0否 1是
     * @return {Set} 敏感词集合
     */
    findAllNew(text, sensitiveWordMap, wordMap, wordWhiteMap, ignoreCase, specialScanWay) {
        let sensitiveWordList = new Set();

        for (let i = 0; i < text.length; i++) {
            let length = this.checkSensitiveWordNew(text, i, this.maxMatchType, sensitiveWordMap, ignoreCase);

            // 精准扫描逻辑
            if (specialScanWay === 1 && length > 0) {
                let subStr = text.substring(i, i + length);

                // 使用正则表达式检测英文单词的逻辑
                let beforeSubStr = text[i - 1] || '';
                let afterSubStr = text[i + length] || '';

                if (i === 0 && /[a-zA-Z]/.test(afterSubStr)) {
                    length = 0;
                } else if (/[a-zA-Z]/.test(afterSubStr)) {
                    length = 0;
                } else if (i - 1 >= 0 && /[a-zA-Z]/.test(beforeSubStr) && beforeSubStr === 'n' && text[i - 2] !== '\\') {
                    length = 0;
                } else if (i - 1 >= 0 && /[a-zA-Z]/.test(beforeSubStr)) {
                    length = 0;
                }
            }

            if (length > 0) {
                let keyWord = text.substring(i, i + length);
                let newKeyWord = ignoreCase === 1 ? keyWord.toLowerCase() : keyWord;

                if (wordMap[newKeyWord] && !wordWhiteMap[newKeyWord]) {
                    sensitiveWordList.add(wordMap[newKeyWord]);
                }

                i = i + length - 1;
            }
        }

        return sensitiveWordList;
    }

    /**
     * @description: 检查文本中的敏感词
     * @param {string} txt 文本内容
     * @param {number} beginIndex 起始索引
     * @param {number} matchType 匹配模式
     * @param {Object} sensitiveWordMap 敏感词Map
     * @param {number} ignoreCase 是否忽略大小写 0否 1是
     * @return {number} 匹配的长度
     */
    checkSensitiveWordNew(txt, beginIndex, matchType, sensitiveWordMap, ignoreCase) {
        let flag = false;
        let matchFlag = 0;
        let firstMatchFlag = 0;
        let nowMap = sensitiveWordMap;

        for (let i = beginIndex; i < txt.length; i++) {
            let word = txt[i];

            if (ignoreCase === 1) {
                word = word.toLowerCase();
            }

            nowMap = nowMap[word];

            if (nowMap) {
                matchFlag++;

                if (nowMap.isEnd === "1") {
                    flag = true;
                    firstMatchFlag = matchFlag;

                    if (this.minMatchType === matchType) {
                        break;
                    }
                }
            } else {
                if (matchFlag > firstMatchFlag) {
                    matchFlag = firstMatchFlag;
                }
                break;
            }
        }

        if (!flag) {
            matchFlag = 0;
        }

        return matchFlag;
    }
}

// 使用示例
let sensitiveWordUtils = new SensitiveWordUtils();

// 大小写开关
let ignoreCase = 0;

// 精准扫描开关
let specialScanWay = 1;

// 词库处理
let wordMap = {};
let wordList = [];
let newWordList = [];

wordList.forEach(item => {
    let word = item;
    if (ignoreCase === 1) {
        word = item.toLowerCase();
    }
    wordMap[word] = item;
    newWordList.push(word);
});

// 白名单处理
let wordWhiteMap = {};
let allWhiteWordList = [];

allWhiteWordList.forEach(item => {
    let word = item;
    if (ignoreCase === 1) {
        word = item.toLowerCase();
    }
    wordWhiteMap[word] = item;
    newWordList.push(word);
});

// 使用示例
let txt = "测试文本";
let sensitiveWordMap = sensitiveWordUtils.initKeyWordAndWhiteList(newWordList);
let result = sensitiveWordUtils.findAllNew(txt, sensitiveWordMap, wordMap, wordWhiteMap, ignoreCase, specialScanWay);

console.log(result);