
export function splitPath(path){
    let result = [];
    let components = path.split("/");
    components.forEach(element => {
      let number = parseInt(element, 10);
      if (isNaN(number)) {
        return; // FIXME shouldn't it throws instead?
      }
      if (element.length > 1 && element[element.length - 1] === "'") {
        number += 0x80000000;
      }
      result.push(number);
    });
    return result;
  }

  export function foreach(arr, callback){
    function iterate(index, array, result) {
        if (index >= array.length) {
            return result;
        }
        else
            return callback(array[index], index).then(function (res) {
                result.push(res);
                return iterate(index + 1, array, result);
            });
    }
    return Promise.resolve().then(function () { return iterate(0, arr, []); });
}
