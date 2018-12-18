/**
 * 修改console.log日志输出，带格式
 * consoleUtil
 */
export default function () {
    let logFun = console.log;

    console.log = function () {
        logFun(new Date().toLocaleString(), ...arguments);
    };

    console.log('hello world');
}