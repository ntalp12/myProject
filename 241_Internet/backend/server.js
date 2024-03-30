const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json())
app.use(cors())

const port = 3000;
let conn = null

const initMysql = async () => {
  conn = await mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'root',
   database: 'webdb',
   port: 8200
 })
}

const validateData= (eduData) => {
  let errors = []
  if (!eduData.fname){
      errors.push('ระบุชื่อ')
  }
  if (!eduData.lname){
      errors.push('ระบุนามสกุล')
  }
  if (!eduData.age){
      errors.push('ระบุอายุ')
  }
  if (!eduData.address){
      errors.push('ระบุที่อยู่')
  }
  if (!eduData.degree){
      errors.push('เลือกระดับการศึกษา')
  }
  if (!eduData.class){
      errors.push('ระบุวิชาที่เรียน')
  }
  if (!eduData.grade){
    errors.push('ระบุผลการเรียน')
  }
  if(!eduData.activity){
    errors.push('ระบุกิจกรรมเสริมการเรียน')
  }
  if(!eduData.teacher_fname || !eduData.teacher_lname){
    errors.push('ระบุชื่อ-นามสกุลของอาจารย์')
  }
  if(!eduData.course){
    errors.push('ระบุวิชาที่สอน')
  }
  if(!eduData.day){
    errors.push('เลือกวันที่เรียน')
  }
  if(!eduData.timestart || !eduData.timeend){
    errors.push('ระบุเวลาเริ่ม-สิ้นสุดการเรียน')
  }
  return errors
}

app.get('/education', async (req, res) => {
  const results = await conn.query('SELECT * FROM education')
  res.json(results[0])
})

app.post('/education', async (req, res) => {
  try {
    let education = req.body
    
    const errors = validateData(education)
    if (errors.length > 0) {
      throw {
        message: 'กรอกข้อมูลไม่ครบ',
        errors: errors
      }
    }
    const results = await conn.query('INSERT INTO education SET ?', education)
    res.json({
      message: 'Create new data successfully',
      data:results[0]
    })
  } catch (error) {
    const errorMessage = error.errors || 'something went wrong'
    const errors = error.errors || []
    console.log('errorMessage',error.message)
    res.status(500).json({
      message: errorMessage,
      errors: errors
    })
  }
})

app.get('/education/:id', async(req, res) => {

  try{
    let id = req.params.id
    const results = await conn.query('SELECT * FROM education WHERE id = ?', id)
    if(results[0].length == 0){
      throw {
        statusCode: 404, 
        message: 'Data not found'
      }
    }
    res.json(results[0][0])

  } catch (error) {
    console.log('errorMessage',error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
 })

app.put('/education/:id', async(req, res) => {

  try {
    let id = req.params.id
    let updateEdu = req.body
    const results = await conn.query('UPDATE education SET ? WHERE id = ?', [updateEdu, id])
    res.json({
      message: 'Update data successfully',
      data:results[0]
    })

  } catch (error) {
    console.log('errorMessage', error.message)
    res.status(500).json({
      message: 'something went wrong'
    })
  }
})

app.delete('/education/:id', async (req, res) => {

  try {
    let id = req.params.id;
    const results = await conn.query('DELETE FROM education WHERE id = ?', id)
    res.json({
      message: 'Delete data successfully',
      data:results[0]
    })
    
  } catch (error) {
    console.log('errorMessage', error.message)
    res.status(500).json({
      message: 'something went wrong'
    })
  }
})

app.listen(port, async(req, res) => {
  await initMysql()
  console.log('http server running on', +port)
})