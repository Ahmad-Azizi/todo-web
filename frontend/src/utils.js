export const setObjsByPriority = (array = [], priority = []) => {
    let priorityArray = new Array(array.length).fill(null);

    array.forEach(val => {
        let currPriority = priority.indexOf(val.id);
        if (currPriority >= 0) priorityArray[currPriority] = val;
        else priorityArray.push(val);
    });

    priorityArray = priorityArray.filter(val => !!val );
    return priorityArray;
}