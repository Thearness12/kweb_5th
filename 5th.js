const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));

let diary = function(id, title, isActive) {
    this.id= id;
    this.title = title;
    this.isActive = isActive;
}

let diaryBook = [];
let count = 0;

app.get('/', (req, res) => {
    res.send('Request  | GET / \nResponse | 200 \nWelcome to my diary');
    res.status(200);
});

app.get('/diaries', (req, res) =>{
    if(count == 0)
    {
        res.status(200).send('Request  | GET /diaries \nResponse | 200 \nNo diary written!');;
    }
    else
    {
        res.status(200).send('Request  | GET /diaries \n Response | 200 \n' 
        + Object.keys(diaryBook).map(key => 
            `#${key}: ${diaryBook[key].title} (${diaryBook[key].isActive})`).join('\n'));;
        }
})

app.get('/diary/:id', (req, res) => {
    if(count < req.params.id)
    {
        res.status(404).send('Request  | GET /diary/ '
        + req.params.id + '\nResponse | 404' 
        + `\nDiary #${req.params.id} does not exist!`);
    }
    if(!diaryBook[req.params.id].isActive)
    {
        res.status(404).send('Request  | GET /diary | '
        + req.params.id + '\nResponse | 404' 
        + `\nDiary #${req.params.id} has already been deleted!`);
    }
    else
    {
        res.send('Request  | GET /diary | '
        + req.params.id + '\nResponse | 200' 
        + `\nDiary #${req.params.id}: ${diaryBook[req.params.id].title} (${diaryBook[req.params.id].isActive})`);
    }
})

app.get('/diary', (req, res)=> {
    if(req.query.id == null)
    {
        res.status(404).send('Invalid Query');
    }
    else
    {
        res.redirect(`/diary/${req.query.id}`);
    }
})

app.post('/diary', (req, res)=> {
    diaryBook[count] = new diary(count, req.body.title, true);
    res.send('Request  | POST /diary | title =' 
    + req.body.title 
    + '\nResponse | 200 \nAdded Diary #' 
    + diaryBook[count].id + ': ' + req.body.title 
    + ' ' + '(' +diaryBook[count].isActive + ')');
    count ++;
})

app.put('/diary', (req, res) => {
    if(count-1 < req.body.id)
    {
        res.status(404).send('Request  | PUT /diary | id='
        + req.body.id + ' title='
        + req.body.title 
        +'\nResponse | 404' + '\nDiary does not exist!');
    }
    else if(!diaryBook[req.body.id].isActive)
    {
        res.status(200).send('Request  | PUT /diary | id='
        + req.body.id + ' title='+ req.body.title +'\nResponse | 200' 
        + `\nDiary #${req.body.id} has already been deleted!`);
    }
    else
    {
        diaryBook[req.body.id].title = req.body.title;
        res.status(200).send('Request  | PUT /diary | id ='
        + req.body.id + ' title='+ req.body.title +'\nResponse | 200' 
        + `\nChanged Diary #${req.body.id}: ${diaryBook[req.body.id].title} (${diaryBook[req.body.id].isActive})`);
    }
})

app.delete('/diary', (req, res)=> {
    if(count < req.body.id)
    {
        res.status(404).send('Request  | PUT /diary | id='
        + req.body.id + ' title=' + req.body.title +'\nResponse | 404' 
        + `\nDiary #${req.body.id} does not exist!`);
    }
    if(!diaryBook[req.body.id].isActive)
    {
        res.status(200).send('Request  | PUT /diary | id='
        + req.body.id + ' title='+ req.body.title +'\nResponse | 200' 
        + `\nDiary #${req.body.id} has already been deleted!`);
    }
    else
    {
        diaryBook[req.body.id].title = '';
        diaryBook[req.body.id].isActive = false;
        res.status(200).send('Request  | PUT /diary | id ='
        + req.body.id + ' title='+ req.body.title +'\nResponse | 200' 
        + `\nDeleted Diary #${req.body.id}: ${diaryBook[req.body.id].title} (${diaryBook[req.body.id].isActive})`);
    }
})

app.listen(port, () => console.log(`Week 5 practice server is working...`)); 

