let problem_set = undefined;
let my_submissions = undefined;
let inview = undefined;
let items_per_page = 100;
let curr_page = 1;

async function get_data(handle) {
    let url = `https://codeforces.com/api/problemset.problems`;
    let response = await fetch(url);
    problem_set = await response.json();
    problem_set = problem_set.result;

    url = `https://codeforces.com/api/user.status?handle=${handle}`;
    response = await fetch(url);
    my_submissions = await response.json();
    console.log("read");
}
let ret = get_data('gun_555');
console.log(ret);


function remove_tag(s) {
    const r = document.getElementById(s);
    r.remove();
}

function add_tag() {
    const items = document.getElementById('tag_select');

    if (items.value != '') {
        const item = items.options[items.selectedIndex];
        const text = item.text;
        const list_of_tags = document.getElementById('selected_tags');
        list_of_tags.innerHTML += `<div style="display: inline;" class="tags" id="${items.value}">
            <p style="display: inline;">${text} </p><img style="cursor: pointer;" onclick="remove_tag('${items.value}')" src="./close-10x10.png">
        </div>`;
    }
}

function test() {
    const x = document.getElementById('selected_tags').children;
    const tags = [];
    for (let i of x) {
        tags.push(i.id);
    }
    // console.log(tags);
}

function change_page(n) {
    curr_page = n;
    display_inview_list();
}


function display_page_buttons() {
    const button_bar = document.getElementById('page_buttons');
    button_bar.innerHTML = ``;
    let p = [1];
    if (inview.length > items_per_page) {
        p.push(Math.ceil(inview.length / items_per_page));
    }
    for (let i = -2; i <= 2; i++) {
        if (curr_page + i > 0 && curr_page + i < Math.ceil(inview.length / items_per_page) && p.includes(curr_page + i) === false) {
            p.push(curr_page + i);
        }
    }
    if (p.includes(2) === false) {
        p.push(2);
    }
    if (p.includes(Math.ceil(inview.length / items_per_page) - 1) === false) {
        p.push(Math.ceil(inview.length / items_per_page) - 1);
    }
    console.log(inview.length);
    console.log(items_per_page)
    p.sort((a, b) => a - b);
    console.log("this is p");
    console.log(p);
    button_bar.innerHTML += `<button onclick='change_page(${p[0]})'>${p[0]}</button>`;
    for (let i = 1; i < p.length; i++) {
        if (p[i - 1] + 1 == p[i]) {
            if (p[i] == curr_page) {
                button_bar.innerHTML += `<button onclick='change_page(${p[i]})'>${p[i]}</button>`;
            }
            else {
                button_bar.innerHTML += `<button onclick='change_page(${p[i]})'>${p[i]}</button>`;
            }
        }
        else {
            button_bar.innerHTML += `<button>. . .</button>`;
            button_bar.innerHTML += `<button onclick='change_page(${p[i]})'>${p[i]}</button>`;
        }
    }

    // button_bar.innerHTML += `<button onclick='change_page(${curr_page+i})'>${curr_page+i}</button>`
}

function rating_sort() {
    const x = document.getElementById("rating_sort_button");
    if (x.src.includes("down_icon_bg_removed.png")) {
        x.src = x.src.replace("down_icon_bg_removed.png", "up_icon_bg_removed.png");
        // ascending
        inview.sort((a, b) => {
            let j = problem_set.problems[a].rating;
            let i = problem_set.problems[b].rating;
            if(i == j){
                return problem_set.problemStatistics[a].solvedCount - problem_set.problemStatistics[b].solvedCount;
            }
            else {
                return j-i;
            }
        });
        display_inview_list();
    }
    else if (x.src.includes("up_icon_bg_removed.png")) {
        x.src = x.src.replace("up_icon_bg_removed.png", "down_icon_bg_removed.png");
        inview.sort((a, b) => {
            let j = problem_set.problems[a].rating;
            let i = problem_set.problems[b].rating;
            if(i == j){
                return problem_set.problemStatistics[a].solvedCount - problem_set.problemStatistics[b].solvedCount;
            }
            else {
                return i-j;
            }
        });
        display_inview_list();
    }
}

async function display_inview_list() {
    const problem_table = document.getElementById('table_body');
    problem_table.innerHTML = ``;
    for (let i = (curr_page - 1) * items_per_page; i < curr_page * items_per_page; i++) {
        problem = problem_set.problems[inview[i]];

        if(problem_set.problemStatistics[inview[i]] === undefined) continue;
        
        people_solved = problem_set.problemStatistics[inview[i]].solvedCount;
        if (problem_set.problemStatistics[inview[i]].contestId == problem.contestId && problem_set.problemStatistics[inview[i]].index == problem.index) {
            console.log("yes");
        }
        else {
            console.log("NOOOOOOOOOOOOO");
        }

        problem_table.innerHTML += `<tr>
                    <td><a href="https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}" target="_blank">${problem.contestId}${problem.index}</a></td>
                    <td>${problem.name}</td>
                    <td class='td_tags'>${problem.tags.join(', ')}</td>
                    <td class='td_rating'>${problem.rating}</td>
                    <td>${people_solved}</td></tr>`;
    }
    display_page_buttons();
}


function search() {
    const x = document.getElementById('selected_tags').children;
    const tags = [];
    for (let i of x) {
        tags.push(i.id);
    }
    console.log(tags);

    let only_selected_tags = document.getElementById('only_selected_tags_check').checked;
    let bring_to_view = []
    if(tags.length === 0 && !only_selected_tags){
        for (let i = 0; i < problem_set.problems.length; i++) {
            if(problem_set.problems[i].rating === undefined){
                continue;
            }
            bring_to_view.push(i);
        }
    }
    else if (only_selected_tags) {
        for (let i = 0; i < problem_set.problems.length; i++) {
            if(problem_set.problems[i].rating === undefined){
                continue;
            }
            let can_i_add = true;
            for (let tag of problem_set.problems[i].tags) {
                if (!tags.includes(tag)) {
                    can_i_add = false;
                    break;
                }
            }
            if (can_i_add) {
                bring_to_view.push(i);
            }
        }
        
    }
    else {
        for (let i = 0; i < problem_set.problems.length; i++) {
            if(problem_set.problems[i].rating === undefined){
                continue;
            }
            for (let tag of problem_set.problems[i].tags) {
                if (tags.includes(tag)) {
                    bring_to_view.push(i);
                    break;
                }
            }
        }
    }
    inview = bring_to_view;
    display_inview_list();
}