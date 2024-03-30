const BASE_URL = 'http://localhost:3000'
let mode = 'CREATE' //defalut mode
let selectedId = ''

window.onload = async() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if(id){
        mode = 'EDIT'
        selectedId = id
        //ดึงข้อมูลและใส่กลับไปใน input
        try {
            const response = await axios.get(`${BASE_URL}/education/${id}`)
            const education = response.data
            console.log(response.data)

            let firstNameDOM = document.querySelector('input[name=fname]')
            let lastNameDOM = document.querySelector('input[name=lname]')
            let ageDOM = document.querySelector('input[name=age]')
            let addressDOM = document.querySelector('textarea[name=address]')
            let degreeDOM = document.querySelector('select[name=degree]')
            let classDOM = document.querySelector('input[name=class]')
            let gradeDOM = document.querySelector('input[name=grade]')
            let activityDOM = document.querySelector('textarea[name=activity]')
            let teacherFnameDOM = document.querySelector('input[name=teacherfname]')
            let teacherLnameDOM = document.querySelector('input[name=teacherlname]')
            let courseDOM = document.querySelector('input[name=course]')
            let dayDOM = document.querySelector('select[name=day]')
            let timestartDOM = document.querySelector('input[name=timestart]')
            let timeendDOM = document.querySelector('input[name=timeend]')
            firstNameDOM.value = education.fname
            lastNameDOM.value = education.lname
            ageDOM.value = education.age
            addressDOM.value = education.address
            degreeDOM.value = education.degree
            classDOM.value = education.class
            gradeDOM.value = education.grade
            activityDOM.value = education.activity
            teacherFnameDOM.value = education.teacher_fname
            teacherLnameDOM.value = education.teacher_lname
            courseDOM.value = education.course
            dayDOM.value = education.day
            timestartDOM.value = education.timestart
            timeendDOM.value = education.timeend

        }catch(error) {
            console.log('error',error)
        }
    }
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

const submitData = async () => {

    let firstNameDOM = document.querySelector('input[name=fname]')
    let lastNameDOM = document.querySelector('input[name=lname]')
    let ageDOM = document.querySelector('input[name=age]')
    let addressDOM = document.querySelector('textarea[name=address]')
    let degreeDOM = document.querySelector('select[name=degree] option:checked')
    let classDOM = document.querySelector('input[name=class]')
    let gradeDOM = document.querySelector('input[name=grade]')
    let activityDOM = document.querySelector('textarea[name=activity]')
    let teacherFnameDOM = document.querySelector('input[name=teacherfname]')
    let teacherLnameDOM = document.querySelector('input[name=teacherlname]')
    let courseDOM = document.querySelector('input[name=course]')
    let dayDOM = document.querySelector('select[name=day] option:checked')
    let timestartDOM = document.querySelector('input[name=timestart]')
    let timeendDOM = document.querySelector('input[name=timeend]')

    let messageDOM = document.getElementById('message')
    
    try {
    console.log('test')
    let eduData = {
        fname: firstNameDOM.value,
        lname: lastNameDOM.value,
        age: ageDOM.value,
        address: addressDOM.value,
        degree: degreeDOM.value,
        class: classDOM.value,
        grade: gradeDOM.value,
        activity: activityDOM.value,
        teacher_fname: teacherFnameDOM.value,
        teacher_lname: teacherLnameDOM.value,
        course: courseDOM.value,
        day: dayDOM.value,
        timestart: timestartDOM.value,
        timeend: timeendDOM.value
    }
    console.log('user submit new data -> ',eduData)
    const errors = validateData(eduData)
    if(errors.length > 0) {
        throw {
            message: 'คุณยังไม่ได้ระบุข้อมูลต่อไปนี้',
            errors: errors
        }
    }
    let message = 'บันทึกข้อมูลเรียบร้อยแล้ว'

    if (mode == 'CREATE') {
        const response = await axios.post(`${BASE_URL}/education`, eduData)
        console.log('response', response.data)
    } else {
        const response = await axios.put(`${BASE_URL}/education/${selectedId}`, eduData)
        message = 'แก้ไขข้อมูลเรียบร้อยแล้ว'
        console.log('response', response.data)
    }
    messageDOM.innerText = message
    messageDOM.className = 'message success'

    } catch(error) {
        console.log('error message', error.message)
        console.log('error', error.errors)

        if (error.response) {
            console.log(error.response)
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }

        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += '</div>'

        messageDOM.innerHTML =  htmlData
        messageDOM.className = 'message danger'
    }
}