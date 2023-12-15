
const today = new Date().toISOString().substring(0, 10);
const todoList = () => {
    all = []

    const add = (todoItem) => {
        all.push(todoItem)
    }

    const markAsComplete = (index) => {
        all[index].completed = true
    }

    const overdue = () => {
        const today = new Date().toLocaleDateString("en-CA");

        const overdueTasks = all.filter((item) => {
            return item.dueDate < today; 
        });

        return overdueTasks;
    };




    const dueToday = () => {
        return all.filter(
            (item) => item.dueDate === new Date().toLocaleDateString("en-CA")
        );
    }

    const dueLater = () => {
        return all.filter(
            (item) => item.dueDate > new Date().toLocaleDateString("en-CA")
        );
    }

    const toDisplayableList = (list) => {
        const dsl = [];
        list.forEach((element) => {
            if (element.dueDate === today) {
                if (element.completed === true) {
                    const a = "[x] " + element.title;
                    dsl.push(a);
                } else {
                    const a = "[ ] " + element.title;
                    dsl.push(a);
                }
            } else {
                if (element.completed === true) {
                    const a = "[x] " + element.title + " " + element.dueDate;
                    dsl.push(a);
                } else {
                    const a = "[ ] " + element.title + " " + element.dueDate;
                    dsl.push(a);
                }
            }
        });
        let g = "";
        for (let i = 0; i < dsl.length; i++) {
            obj = dsl[i];
            if (i === 0) {
                g = g + obj;
            } else {
                g = g + "\n" + obj;
            }
        }
        return g;
    }

    return {
        all,
        add,
        markAsComplete,
        overdue,
        dueToday,
        dueLater,
        toDisplayableList
    };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

module.exports = todoList;
